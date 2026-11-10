
import { useEffect, useState } from "react";
import "./Calendar.css";

// Structure of a saved calendar event.
type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  time?: string;
};

type CalendarView = "month" | "week";

const STORAGE_KEY = "lyfe-check-events";

// Format a date without UTC timezone conversion.
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert YYYY-MM-DD back to a local Date.
function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Format a saved event time.
function displayTime(time?: string): string {
  if (!time) return "All day";

  const [hours, minutes] = time.split(":").map(Number);
  const hour = hours % 12 || 12;

  return `${hour}:${String(minutes).padStart(2, "0")} ${
    hours >= 12 ? "PM" : "AM"
  }`;
}

// Find the Sunday of the selected week.
function getWeekStart(date: Date): Date {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function Calendar() {
  const today = new Date();
  const todayString = formatDate(today);

  // Calendar navigation.
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [view, setView] = useState<CalendarView>("month");

  // Saved events shared with the Home Mini Calendar.
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Event form state.
  const [showForm, setShowForm] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Save events whenever they change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // Keep data updated when another tab changes it.
  useEffect(() => {
    function syncEvents(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;

      try {
        const parsed = event.newValue
          ? JSON.parse(event.newValue)
          : [];

        setEvents(Array.isArray(parsed) ? parsed : []);
      } catch {
        setEvents([]);
      }
    }

    window.addEventListener("storage", syncEvents);

    return () => {
      window.removeEventListener("storage", syncEvents);
    };
  }, []);

  // Navigate to the previous or next month/week.
  function navigate(amount: number) {
    if (view === "month") {
      setCurrentDate(previous =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + amount,
          1
        )
      );
    } else {
      const date = parseDate(selectedDate);
      date.setDate(date.getDate() + amount * 7);

      setSelectedDate(formatDate(date));
      setCurrentDate(
        new Date(date.getFullYear(), date.getMonth(), 1)
      );
    }
  }

  // Return to today.
  function goToToday() {
    const now = new Date();

    setSelectedDate(formatDate(now));
    setCurrentDate(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );
  }

  // Select a calendar day.
  function chooseDate(date: Date) {
    setSelectedDate(formatDate(date));
    setCurrentDate(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );
  }

  // Open the form for a new event.
  function startNewEvent() {
    setEditingId(null);
    setEventTitle("");
    setEventTime("");
    setShowForm(true);
  }

  // Open the form for an existing event.
  function startEditEvent(event: CalendarEvent) {
    setEditingId(event.id);
    setSelectedDate(event.date);
    setEventTitle(event.title);
    setEventTime(event.time || "");
    setShowForm(true);
  }

  // Add or update an event.
  function saveEvent() {
    if (!eventTitle.trim()) return;

    if (editingId) {
      setEvents(previous =>
        previous.map(event =>
          event.id === editingId
            ? {
                ...event,
                date: selectedDate,
                title: eventTitle.trim(),
                time: eventTime,
              }
            : event
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        date: selectedDate,
        title: eventTitle.trim(),
        time: eventTime,
      };

      setEvents(previous => [...previous, newEvent]);
    }

    setShowForm(false);
    setEditingId(null);
    setEventTitle("");
    setEventTime("");
  }

  // Delete an event.
  function deleteEvent(id: string) {
    setEvents(previous =>
      previous.filter(event => event.id !== id)
    );
  }

  // Calendar dates.
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthCells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => new Date(year, month, index + 1)
    ),
  ];

  while (monthCells.length % 7 !== 0) {
    monthCells.push(null);
  }

  // Dates for the weekly view.
  const weekStart = getWeekStart(parseDate(selectedDate));

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  });

  // Selected day's events.
  const selectedDayEvents = events
    .filter(event => event.date === selectedDate)
    .sort((a, b) =>
      (a.time || "").localeCompare(b.time || "")
    );

  const selectedDateObject = parseDate(selectedDate);

  const monthTitle = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Render one calendar date cell.
  function renderDay(date: Date) {
    const dateString = formatDate(date);

    const dayEvents = events
      .filter(event => event.date === dateString)
      .sort((a, b) =>
        (a.time || "").localeCompare(b.time || "")
      );

    const isSelected = dateString === selectedDate;
    const isToday = dateString === todayString;

    return (
      <button
        key={dateString}
        type="button"
        className={[
          "calendar-page-day",
          isSelected ? "selected" : "",
          isToday ? "today" : "",
        ].join(" ")}
        onClick={() => chooseDate(date)}
        aria-label={date.toDateString()}
        aria-pressed={isSelected}
      >
        <span className="calendar-page-day-number">
          {date.getDate()}
        </span>

        <div className="calendar-page-day-events">
          {dayEvents.slice(0, 3).map(event => (
            <span
              key={event.id}
              className="calendar-page-event-pill"
              title={`${displayTime(event.time)} ${event.title}`}
            >
              <span className="calendar-page-event-dot" />
              <span className="calendar-page-event-label">
                {displayTime(event.time)} {event.title}
              </span>
            </span>
          ))}

          {dayEvents.length > 3 && (
            <span className="calendar-page-more">
              +{dayEvents.length - 3} more
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="calendar-page">

      {/* Page header */}
      <div className="calendar-page-header">

        <div className="calendar-page-heading">
          <h1>Calendar</h1>
          <p>
            {events.length}{" "}
            {events.length === 1 ? "event" : "events"} scheduled
          </p>
        </div>

        {/* Calendar controls */}
        <div className="calendar-page-controls">

          <div className="calendar-view-toggle">
            <button
              type="button"
              className={view === "month" ? "active" : ""}
              onClick={() => setView("month")}
            >
              Month
            </button>

            <button
              type="button"
              className={view === "week" ? "active" : ""}
              onClick={() => setView("week")}
            >
              Week
            </button>
          </div>

          <button
            type="button"
            className="calendar-today-button"
            onClick={goToToday}
          >
            Today
          </button>

          <button
            type="button"
            className="calendar-new-event-button"
            onClick={startNewEvent}
          >
            + New Event
          </button>

        </div>
      </div>

      {/* Main two-column layout */}
      <div className="calendar-page-layout">

        {/* Left: Calendar grid */}
        <section className="calendar-page-main">

          <div className="calendar-page-month-header">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Previous period"
            >
              ‹
            </button>

            <h2>
              {view === "month"
                ? monthTitle
                : `${weekDays[0].toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} – ${weekDays[6].toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}`}
            </h2>

            <button
              type="button"
              onClick={() => navigate(1)}
              aria-label="Next period"
            >
              ›
            </button>
          </div>

          {/* Weekday headings */}
          <div className="calendar-page-weekdays">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Month or week grid */}
          <div
            className={[
              "calendar-page-grid",
              view === "week" ? "week-view" : "",
            ].join(" ")}
          >
            {view === "month"
              ? monthCells.map((date, index) =>
                  date
                    ? renderDay(date)
                    : (
                      <div
                        key={`empty-${index}`}
                        className="calendar-page-empty"
                      />
                    )
                )
              : weekDays.map(date => renderDay(date))}
          </div>

        </section>

        {/* Right: Selected day and events */}
        <aside className="calendar-page-sidebar">

          <section className="calendar-selected-card">

            <p className="calendar-sidebar-label">
              SELECTED DAY
            </p>

            <h2>
              {selectedDateObject.toLocaleDateString(
                "en-US",
                { weekday: "long" }
              )}
            </h2>

            <h3>
              {selectedDateObject.toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </h3>

            {selectedDate === todayString && (
              <span className="calendar-today-tag">
                Today
              </span>
            )}

            <button
              type="button"
              className="calendar-sidebar-add"
              onClick={startNewEvent}
            >
              + Add Event
            </button>

          </section>

          <div className="calendar-sidebar-events">

            <p className="calendar-sidebar-label">
              EVENTS ({selectedDayEvents.length})
            </p>

            {selectedDayEvents.length === 0 ? (
              <div className="calendar-sidebar-empty">
                No events scheduled for this day.
              </div>
            ) : (
              selectedDayEvents.map(event => (
                <div
                  key={event.id}
                  className="calendar-sidebar-event"
                >
                  <div className="calendar-sidebar-event-info">
                    <strong>{event.title}</strong>
                    <span>{displayTime(event.time)}</span>
                  </div>

                  <div className="calendar-sidebar-event-actions">
                    <button
                      type="button"
                      onClick={() => startEditEvent(event)}
                      aria-label={`Edit ${event.title}`}
                    >
                      ✎
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteEvent(event.id)}
                      aria-label={`Delete ${event.title}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
        </aside>
      </div>

      {/* Add/edit event dialog */}
      {showForm && (
        <div
          className="calendar-modal-backdrop"
          onClick={() => setShowForm(false)}
        >
          <div
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-modal-title"
            onClick={event => event.stopPropagation()}
          >

            <div className="calendar-modal-header">
              <h2 id="calendar-modal-title">
                {editingId ? "Edit Event" : "New Event"}
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={event => {
                event.preventDefault();
                saveEvent();
              }}
            >

              <label htmlFor="calendar-event-title">
                Event Title
              </label>

              <input
                id="calendar-event-title"
                type="text"
                placeholder="Enter event title"
                value={eventTitle}
                onChange={event =>
                  setEventTitle(event.target.value)
                }
                required
              />

              <label htmlFor="calendar-event-date">
                Date
              </label>

              <input
                id="calendar-event-date"
                type="date"
                value={selectedDate}
                onChange={event =>
                  setSelectedDate(event.target.value)
                }
                required
              />

              <label htmlFor="calendar-event-time">
                Time (optional)
              </label>

              <input
                id="calendar-event-time"
                type="time"
                value={eventTime}
                onChange={event =>
                  setEventTime(event.target.value)
                }
              />

              <div className="calendar-modal-actions">
                <button
                  type="button"
                  className="calendar-modal-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="calendar-modal-save"
                >
                  {editingId ? "Save Changes" : "Create Event"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;
