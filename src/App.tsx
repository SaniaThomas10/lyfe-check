import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Todo from "./pages/Todo";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";

import "./App.css";

// Main application routing.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages that share the top navigation bar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
