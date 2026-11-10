
import { useEffect, useState } from "react";
import "./MiniCalender.css";

// Information stored for each calendar event.
type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  time?: string;
};

// Key used to save calendar events.
const STORAGE_KEY = "lyfe-check-events";

// Convert a date to YYYY-MM-DD using local time.
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert YYYY-MM-DD into a local Date.
function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// Get the Sunday of the selected week.
function getWeekStart(date: Date): Date {
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  start.setDate(start.getDate() - start.getDay());

  return start;
}

// Format an event's time for display.
function displayTime(time?: string): string {
  if (!time) {
    return "All day";
  }

  const [hours, minutes] = time.split(":").map(Number);
  const hour = hours % 12 || 12;
  const suffix = hours >= 12 ? "PM" : "AM";

  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

// Mini Calendar component.
function MiniCalendar() {

  // Current date.
  const today = new Date();

  // Month currently displayed.
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // Date selected by the user.
  const [selectedDate, setSelectedDate] = useState(
    formatDate(today)
  );

  // Calendar events saved by the user.
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // New event information.
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");

  // Whether the add-event form is visible.
  const [showEventForm, setShowEventForm] = useState(false);

  // Save events whenever the array changes.
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(events)
    );
  }, [events]);

  // Move between months.
  function changeMonth(amount: number) {
    setCurrentMonth(
      previous => new Date(
        previous.getFullYear(),
        previous.getMonth() + amount,
        1
      )
    );
  }

  // Add a new calendar event.
  function addEvent() {
    if (!eventTitle.trim()) {
      return;
    }

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      date: selectedDate,
      title: eventTitle.trim(),
      time: eventTime,
    };

    setEvents(previous => [...previous, newEvent]);

    setEventTitle("");
    setEventTime("");
    setShowEventForm(false);
  }

  // Delete a calendar event.
  function deleteEvent(id: string) {
    setEvents(previous =>
      previous.filter(event => event.id !== id)
    );
  }

  // Information about the displayed month.
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthTitle = currentMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // Create empty cells before the first day.
  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    ),
  ];

  // Fill the final row to keep the grid aligned.
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  // Find the seven days in the selected week.
  const selectedDateObject = parseDate(selectedDate);
  const weekStart = getWeekStart(selectedDateObject);

  const weekDays = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return date;
    }
  );

  // Events occurring during the selected week.
  const weeklyEvents = events.filter(event =>
    weekDays.some(day =>
      formatDate(day) === event.date
    )
  );

  // Events occurring on the selected day.
  const selectedDayEvents = events.filter(
    event => event.date === selectedDate
  );

  // Colors for different events.
  const eventColors = [
    "purple",
    "pink",
    "teal",
  ];

  return (
    <section className="mini-calendar">

      {/* Monthly calendar */}
      <div className="calendar-month-card">

        {/* Month navigation */}
        <div className="calendar-month-header">

          <button
            className="calendar-nav-button"
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>

          <h2>{monthTitle}</h2>

          <button
            className="calendar-nav-button"
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>

        </div>

        {/* Weekday headings */}
        <div className="calendar-weekday-grid">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
            day => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            )
          )}
        </div>

        {/* Calendar date grid */}
        <div className="calendar-date-grid">

          {calendarCells.map((day, index) => {

            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="calendar-empty-cell"
                />
              );
            }

            const date = new Date(year, month, day);
            const dateString = formatDate(date);

            const isSelected = dateString === selectedDate;
            const isToday = dateString === formatDate(today);

            const hasEvents = events.some(
              event => event.date === dateString
            );

            return (
              <button
                key={dateString}
                type="button"
                className={[
                  "calendar-date-cell",
                  isSelected ? "selected" : "",
                  isToday ? "today" : "",
                ].join(" ")}
                onClick={() => {
                  setSelectedDate(dateString);
                  setShowEventForm(false);
                }}
                aria-label={date.toDateString()}
                aria-pressed={isSelected}
              >

                <span className="calendar-day-number">
                  {day}
                </span>

                {hasEvents && (
                  <span className="calendar-event-dot" />
                )}

              </button>
            );
          })}

        </div>

      </div>

      {/* Weekly schedule */}
      <div className="calendar-week-card">

        <div className="calendar-week-header">
          <h3>THIS WEEK'S SCHEDULE</h3>

          <span>
            {weeklyEvents.length}{" "}
            {weeklyEvents.length === 1 ? "event" : "events"}
          </span>
        </div>

        <div className="calendar-week-grid">

          {weekDays.map(day => {

            const dateString = formatDate(day);

            const dayEvents = events
              .filter(event => event.date === dateString)
              .sort((a, b) =>
                (a.time || "").localeCompare(b.time || "")
              );

            const isSelected = dateString === selectedDate;

            return (
              <div
                key={dateString}
                className={[
                  "calendar-week-day",
                  isSelected ? "active" : "",
                ].join(" ")}
              >

                <button
                  type="button"
                  className="calendar-week-date"
                  onClick={() => {
                    setSelectedDate(dateString);
                    setCurrentMonth(
                      new Date(
                        day.getFullYear(),
                        day.getMonth(),
                        1
                      )
                    );
                  }}
                >

                  <span>
                    {day.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>

                  <strong>{day.getDate()}</strong>

                </button>

                <div className="calendar-week-events">

                  {dayEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={
                        `calendar-event-pill ${
                          eventColors[index % eventColors.length]
                        }`
                      }
                      title={`${displayTime(event.time)} - ${event.title}`}
                    >

                      <span className="event-pill-time">
                        {displayTime(event.time)}
                      </span>

                      <span className="event-pill-title">
                        {event.title}
                      </span>

                    </div>
                  ))}

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Selected day's events */}
      <div className="calendar-event-manager">

        <div className="calendar-manager-header">

          <div>
            <h3>Events for Selected Day</h3>

            <p>
              {selectedDateObject.toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>

          <button
            type="button"
            className="calendar-add-button"
            onClick={() =>
              setShowEventForm(previous => !previous)
            }
          >
            + Add Event
          </button>

        </div>

        {/* Add event form */}
        {showEventForm && (
          <form
            className="calendar-add-form"
            onSubmit={event => {
              event.preventDefault();
              addEvent();
            }}
          >

            <input
              type="text"
              placeholder="Event name"
              value={eventTitle}
              onChange={event =>
                setEventTitle(event.target.value)
              }
              required
            />

            <input
              type="time"
              value={eventTime}
              onChange={event =>
                setEventTime(event.target.value)
              }
              aria-label="Event time"
            />

            <button type="submit">
              Save Event
            </button>

          </form>
        )}

        {/* List events on selected date */}
        <div className="calendar-selected-events">

          {selectedDayEvents.length === 0 ? (
            <p className="calendar-no-events">
              No events scheduled for this day.
            </p>
          ) : (
            selectedDayEvents.map(event => (
              <div
                key={event.id}
                className="calendar-selected-event"
              >

                <div>
                  <strong>{event.title}</strong>
                  <span>{displayTime(event.time)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => deleteEvent(event.id)}
                  aria-label={`Delete ${event.title}`}
                >
                  ×
                </button>

              </div>
            ))
          )}

        </div>

      </div>

    </section>
  );
}

export default MiniCalendar;
