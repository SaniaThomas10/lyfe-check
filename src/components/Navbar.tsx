
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">

      {/* Top section of the navbar */}
      <div className="navbar-top">

        {/* LYFE CHECK logo */}
        <NavLink to="/" className="navbar-logo">
          <img
            src="/images/lyfe-check-logo.png"
            alt="LYFE CHECK Logo"
          />
        </NavLink>

        {/* Buttons on the right */}
        <div className="navbar-actions">

          {/* AI Assistant button */}
          <button
            className="navbar-ai-button"
            type="button"
          >
            AI Assistant
          </button>

          {/* Profile circle */}
          <NavLink
            to="/profile"
            className="navbar-profile"
            aria-label="Profile"
          />

        </div>
      </div>

      {/* Navigation links */}
      <nav className="navbar-links">

        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/calendar">
          Calendar
        </NavLink>

        <NavLink to="/todo">
          To-Do
        </NavLink>

        <NavLink to="/journal">
          Journal
        </NavLink>

      </nav>
    </header>
  );
}

export default Navbar;
