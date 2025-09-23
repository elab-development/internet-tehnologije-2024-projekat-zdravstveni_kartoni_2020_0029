import {
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
  Stack,
  CircularProgress,
  IconButton,
  Drawer,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  adminMenuItems,
  doctorMenuItems,
  patientMenuItems,
  nurseMenuItems,
} from "../constants/leftsideitems";
import { useRecords } from "./medicalRecord/hooks/useRecords";
import { useEffect, useState } from "react";
import { api } from "../auth/api";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  activeView: string;
  onSelect: (component: string) => void;
};

const LeftSidebar = ({ activeView, onSelect }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();

  const { fetchMyRecordId } = useRecords();
  const [patientMedicalRecordId, setPatientMedicalRecordId] = useState<
    number | null
  >(null);
  const [open, setOpen] = useState(false);

  const displayName = user?.name?.trim() || "Admin";
  const displayEmail = user?.email || "—";

  const initials = (displayName.match(/\b\p{L}/gu) ?? ["?"])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const loadMyRecord = async () => {
      if (user?.role === "patient") {
        try {
          const recordId = await fetchMyRecordId();
          if (recordId) {
            setPatientMedicalRecordId(recordId);
            await api.get(`/medical-records/${recordId}`);
          }
        } catch (err) {
          console.error("Greška pri učitavanju kartona:", err);
        }
      }
    };
    loadMyRecord();
  }, [user]);

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
      : user?.role === "patient"
      ? patientMenuItems
      : nurseMenuItems;

  return (
    <>
      {/* Hamburger dugme */}
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            bgcolor: "white",
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 280,
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Medical Portal</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User Info */}
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
                width: 100,
                height: 100,
                bgcolor: "primary.main",
                fontSize: "2rem",
                mb: 1,
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="h6">{displayName}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {displayEmail}
            </Typography>
            <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
              {user?.role || "—"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Menu */}
          <Stack spacing={1} sx={{ mb: 3 }}>
            {menuItems?.map((x) => {
              const finalLink =
                user?.role === "patient" && patientMedicalRecordId
                  ? x.link.replace(":id", String(patientMedicalRecordId))
                  : x.link;

              const isActive =
                location.pathname.startsWith(finalLink) ||
                activeView === finalLink;

              return (
                <Button
                  key={finalLink}
                  fullWidth
                  variant={isActive ? "contained" : "outlined"}
                  color={isActive ? "primary" : "inherit"}
                  onClick={() => {
                    onSelect(finalLink);
                    navigate(finalLink);
                    setOpen(false); // 👈 zatvori Drawer kad klikneš na item
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                >
                  {x.label}
                </Button>
              );
            })}
          </Stack>

          {/* Logout */}
          <Box sx={{ mt: "auto" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Odjavljivanje..." : "Log out"}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default LeftSidebar;
