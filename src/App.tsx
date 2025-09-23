import "./App.css";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./pages/Login";
import MedicalRecordPage from "./components/medicalRecord/MedicalRecordPage";
import Patients from "./components/patient/PatientsInfo";
import AddPatient from "./components/patient/addPatient";
import Doctors from "./components/doctors/DoctorsInfo";
import AddDoctor from "./components/doctors/addDoctor";
import AppoitmentInfo from "./components/appointments/AppointmentsInfo";
import AddAppointment from "./components/appointments/AddAppointment";
import Layout from "./components/layout/Layout";
import RegisterAsPatient from "./components/patient/RegisterAsPatient";
import ExaminationInfo from "./components/examinations/ExaminationInfo";
import AddExamination from "./components/examinations/AddExamination";
import Nurses from "./components/doctors copy/NursesInfo";
import AddNurse from "./components/doctors copy/addNurse";
import CoronaTrendChart from "./components/coronaReport/CoronaReport";

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
        <Route path="/admin" element={<Layout />} />
        <Route path="/doctor" element={<Layout />} />
        <Route path="/patient" element={<Layout />} />
        <Route path="/nurse" element={<Layout />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/addPatient" element={<AddPatient />} />
        <Route path="nurses" element={<Nurses />} />
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
        <Route path="/medical-records" element={<MedicalRecordPage />} />
        <Route
          path="/medical-records/:medicalRecordId/examinations"
          element={<ExaminationInfo />}
        />
        <Route path="/examinations" element={<ExaminationInfo />} />
        <Route
          path="/medical-records/:medicalRecordId/examinations/add"
          element={<AddExamination />}
        />
        <Route path="/examinations/add" element={<AddExamination />} />
        <Route path="/nurses/add" element={<AddNurse />} />
        <Route path="/corona-report" element={<CoronaTrendChart />} />
        {/* default route → prebaci na login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
