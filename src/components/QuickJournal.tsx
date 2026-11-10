
import { useState } from "react";
import "./QuickJournal.css";

// Define the information stored in a journal entry.
type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  favorite: boolean;
};

// Key used to save journal entries in browser storage.
const STORAGE_KEY = "lyfe-check-journal";

// Quick Journal component for the Home Dashboard.
function QuickJournal() {

  // Store the title entered by the user.
  const [title, setTitle] = useState("");

  // Store the journal text entered by the user.
  const [content, setContent] = useState("");

  // Store the save confirmation message.
  const [message, setMessage] = useState("");

  // Save a new journal entry.
  function saveEntry() {

    // Remove unnecessary spaces.
    const entryTitle = title.trim();
    const entryContent = content.trim();

    // Prevent empty journal entries.
    if (entryContent === "") {
      setMessage("Please write something before saving.");
      return;
    }

    // Create a new journal entry.
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title: entryTitle || "Untitled Entry",
      content: entryContent,
      date: new Date().toISOString(),
      favorite: false,
    };

    try {

      // Retrieve previously saved journal entries.
      const savedEntries = localStorage.getItem(STORAGE_KEY);

      // Convert saved JSON into an array.
      const parsedEntries = savedEntries
        ? JSON.parse(savedEntries)
        : [];

      // Check whether the saved data is an array.
      const journalEntries: JournalEntry[] =
        Array.isArray(parsedEntries)
          ? parsedEntries
          : [];

      // Add the newest entry to the beginning.
      const updatedEntries = [
        newEntry,
        ...journalEntries,
      ];

      // Save the updated journal entries.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedEntries)
      );

      // Clear the form after saving.
      setTitle("");
      setContent("");

      // Display a confirmation message.
      setMessage("Your journal entry was saved!");

    } catch (error) {
      console.error("Unable to save journal entry:", error);

      setMessage(
        "Something went wrong. Your entry was not saved."
      );
    }
  }

  return (
    <section className="quick-journal">

      {/* Journal heading */}
      <div className="quick-journal-header">

        <div>
          <h2>Quick Journal</h2>

          <p>
            Take a moment to reflect on your day.
          </p>
        </div>

        

      </div>

      {/* Journal entry form */}
      <form
        className="quick-journal-form"
        onSubmit={(event) => {
          event.preventDefault();
          saveEntry();
        }}
      >

        {/* Journal title */}
        <label htmlFor="journal-title">
          Entry Title
        </label>

        <input
          id="journal-title"
          type="text"
          placeholder="Give your entry a title..."
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setMessage("");
          }}
        />

        {/* Journal content */}
        <label htmlFor="journal-content">
          Your Thoughts
        </label>

        <textarea
          id="journal-content"
          placeholder="What's on your mind today?"
          rows={5}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setMessage("");
          }}
        />

        {/* Save journal button */}
        <button
          type="submit"
          disabled={content.trim() === ""}
        >
          Save Journal Entry
        </button>

      </form>

      {/* Save confirmation message */}
      {message !== "" && (
        <p className="journal-message" role="status">
          {message}
        </p>
      )}

    </section>
  );
}

export default QuickJournal;
