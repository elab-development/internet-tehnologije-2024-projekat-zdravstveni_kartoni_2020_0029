import {
  Box,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";
import { useAuth } from "../../auth/useAuth";
import { ReactNode, useState } from "react";

const Layout: React.FC<{
  children: ReactNode;
  page?: string;
  crumbs1: any[];
}> = ({ children, page, crumbs1 }) => {
  const [activeView, setActiveView] = useState(page);
  const navigate = useNavigate();
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

  const navigateTo = (link: string) => {
    setActiveView(link);
    navigate(link);
  };

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
    if (activeView === "patients123") {
      crumbs.push({ label: "Patients123", view: "patients" });
    }
    return crumbs;
  };

  const breadcrumbs = crumbs1 ?? getBreadcrumbs();
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <LeftSidebar onSelect={navigateTo} activeView={activeView ?? ""} />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, idx) =>
            idx === breadcrumbs.length - 1 ? (
              <Typography key={idx} color="text.primary" fontWeight="bold">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                href={"/" + crumb.view}
                key={idx}
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
                //onClick={() => crumb.view && setActiveView(crumb.view)}
              >
                {crumb.label}
              </Link>
            )
          )}
        </Breadcrumbs>
        {children}
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
};

export default Layout;
