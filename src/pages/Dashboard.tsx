import {
  Box,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import Patients from "../components/patient/PatientsInfo";
import AddPatient from "../components/patient/addPatient";
import Doctors from "../components/doctors/DoctorsInfo";
import AddDoctor from "../components/doctors/addDoctor";
import AppoitmentInfo from "../components/appointments/AppointmentsInfo";
import AddAppointment from "../components/appointments/AddAppointment";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("patients");
  const { isAuthenticated, loading } = useAuth();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje sesije...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getBreadcrumbs = () => {
    const crumbs: { label: string; view?: string }[] = [
      { label: "", view: "patients" },
    ];

    if (activeView === "patients") {
      crumbs.push({ label: "Patients", view: "patients" });
    }
    if (activeView === "addPatient") {
      crumbs.push({ label: "Patients", view: "patients" });
      crumbs.push({ label: "New Patient", view: "addPatient" });
    }

    if (activeView === "doctors") {
      crumbs.push({ label: "Doctors", view: "doctors" });
    }
    if (activeView === "addDoctor") {
      crumbs.push({ label: "Doctors", view: "doctors" });
      crumbs.push({ label: "New Doctor", view: "addDoctor" });
    }

    if (activeView === "appointments") {
      crumbs.push({ label: "Appointments", view: "appointments" });
    }
    if (activeView === "addAppointment") {
      crumbs.push({ label: "Appointments", view: "appointments" });
      crumbs.push({ label: "New Appointment", view: "addAppointment" });
    }

    return crumbs;
  };

  const renderContent = () => {
    switch (activeView) {
      case "patients":
        return <Patients onAddPatient={() => setActiveView("addPatient")} />;
      case "addPatient":
        return (
          <AddPatient
            onCancel={() => setActiveView("patients")}
            onSuccess={() => {
              setActiveView("patients");
              setSuccessMessage("Patient created successfully ✅");
            }}
          />
        );
      case "doctors":
        return <Doctors onAddDoctor={() => setActiveView("addDoctor")} />;
      case "addDoctor":
        return (
          <AddDoctor
            onCancel={() => setActiveView("doctors")}
            onSuccess={() => {
              setActiveView("doctors");
              setSuccessMessage("Doctor created successfully ✅");
            }}
          />
        );
      case "appointments":
        return (
          <AppoitmentInfo
            onAddAppointment={() => setActiveView("addAppointment")}
          />
        );
      case "addAppointment":
        return (
          <AddAppointment
            onCancel={() => setActiveView("appointments")}
            onSuccess={() => {
              setActiveView("appointments");
              setSuccessMessage("Appointment created successfully ✅");
            }}
          />
        );
      default:
        return <Patients onAddPatient={() => setActiveView("addPatient")} />;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <LeftSidebar onSelect={setActiveView} activeView={activeView} />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {getBreadcrumbs().map((crumb, idx) =>
            idx === getBreadcrumbs().length - 1 ? (
              <Typography key={idx} color="text.primary" fontWeight="bold">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={idx}
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
                onClick={() => crumb.view && setActiveView(crumb.view)}
              >
                {crumb.label}
              </Link>
            )
          )}
        </Breadcrumbs>

        {renderContent()}

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccessMessage(null)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
