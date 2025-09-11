import { useState } from "react";
import { Box, Typography, CircularProgress, Breadcrumbs, Link } from "@mui/material";
import { Navigate } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import AppoitmentInfo from "../components/AppoitmentsInfo";
import Patients from "../components/PatientsInfo";
import Doctors from "../components/DoctorsInfo";
import { useAuth } from "../auth/useAuth";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("doctors");
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje sesije...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeView) {
      case "appointments":
        return <AppoitmentInfo />;
      case "patients":
        return <Patients />;
      case "doctors":
        return <Doctors />;
      default:
        return <Doctors />;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <LeftSidebar onSelect={setActiveView} activeView={activeView} />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* 👇 OVDE ide breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="#">
            Dashboard
          </Link>
          <Typography color="text.primary">
            {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          </Typography>
        </Breadcrumbs>

        {renderContent()}
      </Box>
    </Box>
  );
}









