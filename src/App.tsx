
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { supabase } from "./lib/supabase";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Todo from "./pages/Todo";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

import "./App.css";

function App() {
  useEffect(() => {
    async function testSupabase() {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error(
          "Supabase Auth error:",
          error.message
        );
      } else {
        console.log(
          "Supabase Auth client initialized!"
        );
      }
    }

    testSupabase();
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Existing application pages */}
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
