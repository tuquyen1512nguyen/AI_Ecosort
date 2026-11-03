import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Guide from "./pages/Guide";
import Quiz from "./pages/Quiz";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Invalid user JSON:", e);
      }
    }
  }, []);

  return (
    <div className="app-layout">
      <ScrollToTop />
      <Navbar user={user} setUser={setUser} />

      <div className="app-main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan user={user} />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/quiz" element={<Quiz user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/history"
            element={user ? <History user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/statistics"
            element={user?.role === "admin" ? <Statistics /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}