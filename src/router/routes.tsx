import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";   // ovo je zajednički
import DoctorDashboard from "./pages/DoctorDashboard"; // posebni
import PatientDashboard from "./pages/PatientDashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Admin (koristi tvoj stari Dashboard) */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Doctor */}
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

      {/* Patient */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
    </Routes>
  );
}

export default App;



