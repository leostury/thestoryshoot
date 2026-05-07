import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import StudiosPage from "./pages/StudiosPage";
import ThemeDetailPage from "./pages/ThemeDetailPage";
import Login from "./pages/login";
import BookingPage from "./pages/BookingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/studios" element={<StudiosPage />} />
        <Route path="/studios/:type" element={<ThemeDetailPage />} />
        <Route path="/login" element={<Login />} />
        {/* Sekarang rute ini tidak akan error lagi */}
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
