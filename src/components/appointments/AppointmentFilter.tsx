import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type AppointmentFiltersProps = {
  patientSearch: string;
  setPatientSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  user: { role?: string } | null;
};

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  patientSearch,
  setPatientSearch,
  statusFilter,
  setStatusFilter,
  user,
}) => {
  const statusOptions = ["scheduled", "completed", "canceled", "no_show"];
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        userSelect: "none",
      }}
    >
      <Typography variant="h4">Appointments</Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Pretraga po pacijentu */}
        <TextField
          size="small"
          placeholder="Search patients..."
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
        />

        {/* Filtriranje po statusu */}
        <Select
          size="small"
          displayEmpty
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">All statuses</MenuItem>
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>

        {/* Dugme za dodavanje termina → samo admin i nurse */}
        {(user?.role === "admin" || user?.role === "nurse") && (
          <Button
            variant="contained"
            onClick={() => navigate("/appointments/addAppointment")}
          >
            New Appoitment
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentFilters;
