import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth"; // Izmenjen import put
import {
  adminMenuItems,
  doctorMenuItems,
  patientMenuItems,
} from "../constants/leftsideitems";

type Props = {
  onSelect: (component: string) => void;
  activeView: string;
  onFetchAppointments?: () => void;
};

const LeftSidebar = ({ activeView, onSelect, onFetchAppointments }: Props) => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth(); // Promenjeno isLoading u loading

  const displayName = user?.name?.trim() || "Admin";
  const displayEmail = user?.email || "—";

  const initials = (displayName.match(/\b\p{L}/gu) ?? ["?"])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const menuItems =
    user?.role === "admin"
      ? adminMenuItems
      : user?.role === "doctor"
      ? doctorMenuItems
      : patientMenuItems;

  return (
    <Paper
      elevation={3}
      sx={{
        width: 300,
        p: 3,
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Medical Portal</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            bgcolor: "primary.main",
            fontSize: "3rem",
            mb: 2,
          }}
        >
          {initials}
        </Avatar>

        <Typography variant="h6" component="h2">
          {displayName}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary">
          {displayEmail}
        </Typography>

        {/* Prikaz uloge korisnika */}
        <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
          {user?.role || "—"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1} sx={{ mb: 3 }}>
        {/*<Button
          fullWidth
          variant={activeView === "doctors" ? "contained" : "outlined"}
          onClick={() => onSelect("doctors")}
          sx={{ justifyContent: "flex-start" }}
        >
          Doctors
        </Button>
        <Button
          fullWidth
          variant={activeView === "patients" ? "contained" : "outlined"}
          onClick={() => onSelect("patients")}
          sx={{ justifyContent: "flex-start" }}
        >
          Patients
        </Button>
        <Button
          fullWidth
          variant={activeView === "appointments" ? "contained" : "outlined"}
          onClick={() => {
            onSelect("appointments");
            onFetchAppointments?.();
          }}
          sx={{ justifyContent: "flex-start" }}
        >
          Appointments
        </Button>*/}

        {menuItems?.map((x) => (
          <Button
            key={x.link}
            fullWidth
            variant={activeView === x.link ? "contained" : "outlined"}
            onClick={() => {
              onSelect(x.link);
              //onFetchAppointments?.();
            }}
            sx={{ justifyContent: "flex-start" }}
          >
            {x.label}
          </Button>
        ))}
      </Stack>

      <Box sx={{ mt: "auto" }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleLogout}
          disabled={loading} // Onemogući dugme tokom logout-a
        >
          {loading ? "Odjavljivanje..." : "Log out"}
        </Button>
      </Box>
    </Paper>
  );
};

export default LeftSidebar;
