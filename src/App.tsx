import "./App.css";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MedicalRecordPage from "./components/medicalRecord/MedicalRecordPage";
import Patients from "./components/patient/PatientsInfo";
import AddPatient from "./components/patient/addPatient";
import Doctors from "./components/doctors/DoctorsInfo";
import AddDoctor from "./components/doctors/addDoctor";
import AppoitmentInfo from "./components/appointments/AppoitmentsInfo";
import AddAppointment from "./components/appointments/AddAppointment";
import Layout from "./components/layout/Layout";

const theme = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
  },
});

function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Login stranica */}
        <Route path="/login" element={<LoginForm />} />

        {/* Sve admin rute unutar Layout-a */}
        <Route path="/admin/dashboard" element={<Dashboard />}>
          <Route path="patients" element={<Patients />} />
          <Route path="addPatient" element={<AddPatient />} />

          <Route path="doctors" element={<Doctors />} />
          <Route path="addDoctor" element={<AddDoctor />} />

          <Route path="appointments" element={<AppoitmentInfo />} />
          <Route path="addAppointment" element={<AddAppointment />} />

          <Route
            path="patients/medical-record/:patientId"
            element={<MedicalRecordPage />}
          />
        </Route>

        {/* default route → prebaci na login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
