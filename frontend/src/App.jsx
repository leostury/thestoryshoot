import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React, { useEffect } from "react";
import Dashboard from "./pages/dashboard";
import StudiosPage from "./pages/StudiosPage";
import ThemeDetailPage from "./pages/ThemeDetailPage";
import Login from "./pages/login";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import InvoicePage from "./pages/InvoicePage";
import BookingDetail from "./pages/BookingDetail";

const AutoLogoutHandler = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(handleAutoLogout, 15 * 60 * 1000);
    };

    const handleAutoLogout = () => {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        alert("Sesi Anda telah berakhir karena tidak ada aktivitas.");
        navigate("/login");
        window.location.reload();
      }
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate]);

  return children;
};

function App() {
  return (
    <Router>
      <AutoLogoutHandler>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/studios" element={<StudiosPage />} />
          <Route path="/studios/:type" element={<ThemeDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/invoice/:kode_booking" element={<InvoicePage />} />

          <Route path="/bookings/:id" element={<BookingDetail />} />
        </Routes>
      </AutoLogoutHandler>
    </Router>
  );
}

export default App;
