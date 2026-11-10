
import type { CalendarEvent } from "../models/Event.js";

// Store calendar events temporarily
let events: CalendarEvent[] = [];

// Get all calendar events
export function getEvents(): CalendarEvent[] {
  return [...events];
}

// Add a new calendar event
export function addEvent(event: CalendarEvent): void {
  events.push(event);
}

// Update an existing calendar event
export function updateEvent(
  id: string,
  updatedEvent: Partial<CalendarEvent>
): boolean {
  const event = events.find((event) => event.id === id);

  // Check if the event exists
  if (!event) {
    return false;
  }

  // Update the event information
  Object.assign(event, updatedEvent);

  return true;
}

// Delete a calendar event
export function deleteEvent(id: string): boolean {
  const originalLength = events.length;

  // Remove the event with the matching ID
  events = events.filter((event) => event.id !== id);

  return events.length < originalLength;
}
