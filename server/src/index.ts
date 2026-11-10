
import type { CalendarEvent } from "./models/Event.js";
import type { Task } from "./models/Task.js";
import type { Mood } from "./models/Mood.js";
import type { JournalEntry } from "./models/Journal.js";

import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "./services/EventService.js";

import {
  getTasks,
  addTask,
  updateTask,
  toggleTask,
  deleteTask,
} from "./services/TaskServices.js";

import {
  getMoods,
  addMood,
  updateMood,
  getMoodsByDate,
  deleteMood,
} from "./services/MoodService.js";

import {
  getJournals,
  addJournal,
  updateJournal,
  toggleFavorite,
  getJournalsByDate,
  deleteJournal,
} from "./services/JournalServices.js";

// Name of the application
const appName: string = "LYFE CHECK";

// Display the backend information
console.log(`${appName} Backend`);

// Create a test calendar event
const testEvent: CalendarEvent = {
  id: "event-001",
  date: "2026-10-15",
  title: "Study for Data Structures",
  time: "14:00",
};

// Add the calendar event
addEvent(testEvent);

console.log("After adding an event:");
console.log(getEvents());

// Update the calendar event
updateEvent("event-001", {
  title: "Finish Data Structures Homework",
});

console.log("After updating the event:");
console.log(getEvents());

// Delete the calendar event
deleteEvent("event-001");

console.log("After deleting the event:");
console.log(getEvents());

// Create a test daily task
const testTask: Task = {
  id: "task-001",
  title: "Finish homework",
  completed: false,
  date: "2026-10-15",
};

// Add the daily task
addTask(testTask);

console.log("After adding a task:");
console.log(getTasks());

// Update the task title
updateTask("task-001", {
  title: "Finish Statistics Homework",
});

console.log("After updating the task:");
console.log(getTasks());

// Mark the task as completed
toggleTask("task-001");

console.log("After completing the task:");
console.log(getTasks());

// Delete the daily task
deleteTask("task-001");

console.log("After deleting the task:");
console.log(getTasks());

// Create a test mood entry
const testMood: Mood = {
  id: "mood-001",
  mood: "Good",
  date: "2026-10-15",
};

// Add the mood entry
addMood(testMood);

console.log("After adding a mood:");
console.log(getMoods());

// Update the mood entry
updateMood("mood-001", {
  mood: "Amazing",
});

console.log("After updating the mood:");
console.log(getMoods());

// Get mood entries for a specific date
console.log("Moods for October 15:");
console.log(getMoodsByDate("2026-10-15"));

// Delete the mood entry
deleteMood("mood-001");

console.log("After deleting the mood:");
console.log(getMoods());

// Create a test journal entry
const testJournal: JournalEntry = {
  id: "journal-001",
  title: "My Day",
  content: "Today was a productive day.",
  date: "2026-10-15",
  favorite: false,
};

// Add the journal entry
addJournal(testJournal);

console.log("After adding a journal entry:");
console.log(getJournals());

// Update the journal entry
updateJournal("journal-001", {
  title: "A Productive Day",
  content: "I finished my homework and worked on LYFE CHECK.",
});

console.log("After updating the journal entry:");
console.log(getJournals());

// Mark the journal entry as a favorite
toggleFavorite("journal-001");

console.log("After favoriting the journal entry:");
console.log(getJournals());

// Get journal entries for a specific date
console.log("Journal entries for October 15:");
console.log(getJournalsByDate("2026-10-15"));

// Delete the journal entry
deleteJournal("journal-001");

console.log("After deleting the journal entry:");
console.log(getJournals());

// Check that all services are working
console.log("All LYFE CHECK services are working!");
