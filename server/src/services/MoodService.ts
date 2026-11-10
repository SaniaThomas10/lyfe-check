
import type { Mood } from "../models/Mood.js";

// Store mood entries temporarily
let moods: Mood[] = [];

// Get all mood entries
export function getMoods(): Mood[] {
  return [...moods];
}

// Add a new mood entry
export function addMood(mood: Mood): void {
  moods.push(mood);
}

// Update an existing mood entry
export function updateMood(
  id: string,
  updatedMood: Partial<Mood>
): boolean {
  const mood = moods.find((mood) => mood.id === id);

  // Check if the mood entry exists
  if (!mood) {
    return false;
  }

  // Update the mood information
  Object.assign(mood, updatedMood);

  return true;
}

// Get all mood entries for a specific date
export function getMoodsByDate(date: string): Mood[] {
  return moods.filter((mood) => mood.date === date);
}

// Delete a mood entry
export function deleteMood(id: string): boolean {
  const originalLength = moods.length;

  // Remove the mood with the matching ID
  moods = moods.filter((mood) => mood.id !== id);

  return moods.length < originalLength;
}
