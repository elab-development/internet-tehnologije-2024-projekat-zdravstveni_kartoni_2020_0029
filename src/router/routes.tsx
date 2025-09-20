import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard"; // zajednički
import DoctorDashboard from "../pages/DoctorDashboard";
import PatientDashboard from "../pages/PatientDashboard";

// Uvoziš unutrašnje stranice
import Patients from "../components/patient/PatientsInfo";
import AddPatient from "../components/patient/addPatient";
import Doctors from "../components/doctors/DoctorsInfo";
import AddDoctor from "../components/doctors/addDoctor";
import AppoitmentInfo from "../components/appointments/AppointmentsInfo";
import AddAppointment from "../components/appointments/AddAppointment";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard kao parent */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/*<Route path="patients" element={<Patients />} />
        <Route path="addPatient" element={<AddPatient />} />

        <Route path="doctors" element={<Doctors />} />
        <Route path="addDoctor" element={<AddDoctor />} />

        <Route path="appointments" element={<AppoitmentInfo />} />
        <Route path="addAppointment" element={<AddAppointment />} />*/}
      </Route>

      {/* Doctor */}
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

      {/* Patient */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
    </Routes>
  );
}

export default App;
