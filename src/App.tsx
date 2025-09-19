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
import Layout from "./components/layout/Layout";
import RegisterAsPatient from "./components/patient/RegisterAsPatient";

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

        {/* Regoister stranica */}
        <Route path="/register/asPatient" element={<RegisterAsPatient />} />

        {/* Admin dashboard */}
        <Route path="/admin/dashboard" element={<Layout />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/addPatient" element={<AddPatient />} />

        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/addDoctor" element={<AddDoctor />} />

        <Route path="appointments" element={<AppoitmentInfo />} />
        <Route
          path="appointments/addAppointment"
          element={<AddAppointment />}
        />
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
