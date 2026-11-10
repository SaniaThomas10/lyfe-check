
// Different moods the user can select
export type MoodType =
  | "Amazing"
  | "Good"
  | "Okay"
  | "Low"
  | "Stressed";

// Structure for a mood entry
export interface Mood {
  id: string;
  mood: MoodType;
  date: string;
}
