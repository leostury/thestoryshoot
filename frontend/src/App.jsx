import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Utama: Branding & Katalog */}
        <Route path="/" element={<Dashboard />} />

        {/* Halaman Login: Full Page tanpa gangguan Navbar */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
