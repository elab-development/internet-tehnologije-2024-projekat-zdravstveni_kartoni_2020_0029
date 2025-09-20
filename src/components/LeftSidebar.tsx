import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  adminMenuItems,
  doctorMenuItems,
  patientMenuItems,
  nurseMenuItems,
} from "../constants/leftsideitems";
import { useRecords } from "./medicalRecord/hooks/useRecords";
import { useEffect, useState } from "react";
import { api } from "../auth/api"; // 👈 treba ti jer povlačiš ceo record

type Props = {
  onSelect: (component: string) => void;
  activeView: string;
  onFetchAppointments?: () => void;
};

const LeftSidebar = ({ activeView, onSelect }: Props) => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const { fetchMyRecordId } = useRecords();
  const [patientMedicalRecordId, setPatientMedicalRecordId] = useState<
    number | null
  >(null);
  const [patientMedicalRecord, setPatientMedicalRecord] = useState<any | null>(
    null
  );
  const [fetchingRecord, setFetchingRecord] = useState(false);

  const displayName = user?.name?.trim() || "Admin";
  const displayEmail = user?.email || "—";

  const initials = (displayName.match(/\b\p{L}/gu) ?? ["?"])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // 🔥 Uzimanje medical_record_id + celog recorda kada se pacijent uloguje
  useEffect(() => {
    const loadMyRecord = async () => {
      if (user?.role === "patient") {
        setFetchingRecord(true);
        try {
          const recordId = await fetchMyRecordId();
          if (recordId) {
            setPatientMedicalRecordId(recordId);

            // 👇 odmah povuci ceo karton
            const res = await api.get(`/medical-records/${recordId}`);
            const raw =
              typeof res.data === "string"
                ? JSON.parse(res.data.replace(/^\uFEFF/, ""))
                : res.data;

            if (raw.success && raw.data) {
              setPatientMedicalRecord(raw.data);
            }
          }
        } catch (err) {
          console.error("Greška pri učitavanju kartona:", err);
        } finally {
          setFetchingRecord(false);
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

  // 👮 Meniji po ulozi
  const menuItems =
    user?.role === "admin"
      ? adminMenuItems
      : user?.role === "doctor"
      ? doctorMenuItems
      : user?.role === "patient"
      ? patientMenuItems
      : nurseMenuItems;

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
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Medical Portal</Typography>
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

        <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
          {user?.role || "—"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Menu */}
      {user?.role === "patient" && fetchingRecord ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {menuItems?.map((x) => {
            const finalLink =
              user?.role === "patient" && patientMedicalRecordId
                ? x.link.replace(":id", String(patientMedicalRecordId))
                : x.link;

            return (
              <Button
                key={finalLink}
                fullWidth
                variant={activeView === finalLink ? "contained" : "outlined"}
                onClick={() => onSelect(finalLink)}
                sx={{ justifyContent: "flex-start" }}
              >
                {x.label}
              </Button>
            );
          })}
        </Stack>
      )}

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
    </Paper>
  );
};

export default LeftSidebar;
