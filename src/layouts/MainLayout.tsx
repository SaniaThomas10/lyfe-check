
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

// Shared layout for the main application pages.
function MainLayout() {
  return (
    <div className="app-layout">
      {/* Navigation stays visible across pages */}
      <Navbar />

      {/* React Router displays the selected page here */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
