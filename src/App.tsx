import "./App.css";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./pages/Login"; // prilagodi putanju
import Dashboard from "./pages/Dashboard"; // prilagodi putanju
import MedicalRecordPage from "./components/medicalRecord/MedicalRecordPage";
import Patients from "./components/patient/PatientsInfo";
import AddPatient from "./components/patient/addPatient";
import Doctors from "./components/doctors/DoctorsInfo";
import AddDoctor from "./components/doctors/addDoctor";
import AppoitmentInfo from "./components/appointments/AppoitmentsInfo";
import AddAppointment from "./components/appointments/AddAppointment";

// definiši temu
const theme = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
  },
});

// komponenta App
function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Login stranica */}
        <Route path="/login" element={<LoginForm />} />

        {/* Admin dashboard */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="addPatient" element={<AddPatient />} />

        <Route path="doctors" element={<Doctors />} />
        <Route path="addDoctor" element={<AddDoctor />} />

        <Route path="appointments" element={<AppoitmentInfo />} />
        <Route path="addAppointment" element={<AddAppointment />} />
        {/*<Route
          path="/medical-records"
          element={<MedicalRecordsPage />}
        />*/}
        <Route
          path="/patients/medical-record/:patientId"
          element={<MedicalRecordPage />}
        />
        {/* default route → prebaci na login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
