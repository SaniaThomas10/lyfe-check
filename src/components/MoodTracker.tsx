
import { useState } from "react";
import "./MoodTracker.css";

// Define the information for each mood option.
type Mood = {
  emoji: string;
  name: string;
};

// Available mood options.
const moodOptions: Mood[] = [
  { emoji: "😄", name: "Amazing" },
  { emoji: "🙂", name: "Good" },
  { emoji: "😐", name: "Okay" },
  { emoji: "😔", name: "Low" },
  { emoji: "😣", name: "Stressed" },
];

// Key used to save moods in browser storage.
const STORAGE_KEY = "lyfe-check-moods";

// Get today's date in local YYYY-MM-DD format.
function getTodayKey() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Mood Tracker component for the Home Dashboard.
function MoodTracker() {

  // Today's date is used to identify today's mood entry.
  const todayKey = getTodayKey();

  // Load the previously saved mood for today.
  const [selectedMood, setSelectedMood] = useState<string>(() => {
    try {
      const savedMoods = localStorage.getItem(STORAGE_KEY);

      if (savedMoods) {
        const parsedMoods = JSON.parse(savedMoods);

        if (
          parsedMoods &&
          typeof parsedMoods === "object" &&
          !Array.isArray(parsedMoods)
        ) {
          const savedMood = parsedMoods[todayKey];

          if (
            moodOptions.some((mood) => mood.name === savedMood)
          ) {
            return savedMood;
          }
        }
      }
    } catch (error) {
      console.error("Unable to load saved mood:", error);
    }

    return "";
  });

  // Remember which mood was last saved.
  const [savedMood, setSavedMood] = useState(selectedMood);

  // Save the selected mood for today's date.
  function saveMood() {

    // Prevent saving when no mood is selected.
    if (selectedMood === "") {
      return;
    }

    try {
      // Load the existing mood history.
      const savedMoods = localStorage.getItem(STORAGE_KEY);

      const parsedMoods = savedMoods
        ? JSON.parse(savedMoods)
        : {};

      // Ensure the saved history is an object.
      const moodHistory =
        parsedMoods &&
        typeof parsedMoods === "object" &&
        !Array.isArray(parsedMoods)
          ? parsedMoods
          : {};

      // Add or update today's mood.
      moodHistory[todayKey] = selectedMood;

      // Save the updated mood history.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(moodHistory)
      );

      // Update the confirmation message.
      setSavedMood(selectedMood);

    } catch (error) {
      console.error("Unable to save mood:", error);
    }
  }

  return (
    <section className="mood-tracker">

      {/* Mood Tracker heading */}
      <div className="mood-header">
        <div>
          <h2>How are you feeling today?</h2>

          <p>
            Take a moment to check in with yourself.
          </p>
        </div>

        
      </div>

      {/* Available mood options */}
      <div className="mood-options">

        {moodOptions.map((mood) => (

          <button
            key={mood.name}
            type="button"
            className={
              selectedMood === mood.name
                ? "mood-option selected"
                : "mood-option"
            }
            onClick={() => setSelectedMood(mood.name)}
            aria-pressed={selectedMood === mood.name}
          >

            {/* Mood emoji */}
            <span className="mood-emoji">
              {mood.emoji}
            </span>

            {/* Mood name */}
            <span className="mood-name">
              {mood.name}
            </span>

          </button>

        ))}

      </div>

      {/* Save mood button */}
      <button
        type="button"
        className="save-mood-button"
        onClick={saveMood}
        disabled={selectedMood === ""}
      >
        Save Today's Mood
      </button>

      {/* Confirmation message */}
      {savedMood !== "" && (
        <p className="mood-confirmation">
          Today's mood saved: {savedMood}
        </p>
      )}

    </section>
  );
}

export default MoodTracker;
