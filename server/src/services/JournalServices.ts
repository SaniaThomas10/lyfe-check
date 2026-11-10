
import type { JournalEntry } from "../models/Journal.js";

// Store journal entries temporarily
let journals: JournalEntry[] = [];

// Get all journal entries
export function getJournals(): JournalEntry[] {
  return [...journals];
}

// Add a new journal entry
export function addJournal(journal: JournalEntry): void {
  journals.push(journal);
}

// Update an existing journal entry
export function updateJournal(
  id: string,
  updatedJournal: Partial<JournalEntry>
): boolean {
  const journal = journals.find((journal) => journal.id === id);

  // Check if the journal entry exists
  if (!journal) {
    return false;
  }

  // Update the journal information
  Object.assign(journal, updatedJournal);

  return true;
}

// Mark a journal entry as a favorite or remove it
export function toggleFavorite(id: string): boolean {
  const journal = journals.find((journal) => journal.id === id);

  // Check if the journal entry exists
  if (!journal) {
    return false;
  }

  // Change the favorite status
  journal.favorite = !journal.favorite;

  return true;
}

// Get journal entries for a specific date
export function getJournalsByDate(date: string): JournalEntry[] {
  return journals.filter((journal) => journal.date === date);
}

// Delete a journal entry
export function deleteJournal(id: string): boolean {
  const originalLength = journals.length;

  // Remove the journal with the matching ID
  journals = journals.filter((journal) => journal.id !== id);

  return journals.length < originalLength;
}
