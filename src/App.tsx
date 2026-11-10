
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Todo from "./pages/Todo";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

import "./App.css";

// Set up navigation for the application.
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Pages that require a signed-in user */}
        <Route element={<ProtectedRoute />}>

          {/* Main application layout */}
          <Route element={<MainLayout />}>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/calendar"
              element={<Calendar />}
            />

            <Route
              path="/todo"
              element={<Todo />}
            />

            <Route
              path="/journal"
              element={<Journal />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>
        </Route>

        {/* Redirect unknown pages to Home */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
