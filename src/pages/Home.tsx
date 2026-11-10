import DailyTasks from "../components/DailyTasks";
import MoodTracker from "../components/MoodTracker";
import MiniCalendar from "../components/MiniCalender";
import QuickJournal from "../components/QuickJournal";
import "./Home.css";

// Home Dashboard component for LYFE CHECK.
function Home() {

  // Get the current date.
  const today = new Date();

  // Format today's date.
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="home-page">

      {/* Welcome section */}
      <section className="welcome-section">

        <div className="welcome-text">

          {/* Display today's date */}
          <p className="welcome-date">
            {formattedDate}
          </p>

          {/* Main heading */}
          <h1>Welcome to LYFE CHECK!</h1>

          {/* Dashboard description */}
          <p className="welcome-description">
            Your personal space to stay organized,
            track your mood, and build healthier habits.
          </p>

        </div>

      </section>

      {/* Main dashboard layout */}
      <div className="dashboard-grid">

        {/* Left column: Daily Tasks */}
        <div className="dashboard-tasks">
          <DailyTasks />
        </div>

        {/* Middle column: Mini Calendar */}
        <div className="dashboard-calendar">
          <MiniCalendar />
        </div>

        {/* Right column: Journal and Mood Tracker */}
        <div className="dashboard-right">

          {/* Quick Journal at the top */}
          <QuickJournal />

          {/* Mood Tracker below the journal */}
          <MoodTracker />

        </div>

      </div>

    </div>
  );
}

export default Home;
