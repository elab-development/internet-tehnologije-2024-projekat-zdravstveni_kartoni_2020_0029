import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type AppointmentFiltersProps = {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  user: { role?: string } | null;
};

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  user,
}) => {
  const statusOptions = ["scheduled", "completed", "canceled", "no_show"];
  const navigate = useNavigate();

  const canCreate = user?.role === "admin" || user?.role === "nurse";

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filtriranje po statusu */}
        <Select
          size="small"
          displayEmpty
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">All statuses</MenuItem>
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>

        {/* Dugme za dodavanje termina */}
        {canCreate ? (
          <Button
            variant="contained"
            onClick={() => navigate("/appointments/addAppointment")}
          >
            New Appointment
          </Button>
        ) : (
          <Tooltip title="Samo administrator i sestra mogu da kreiraju termine">
            <span>
              <Button variant="contained" disabled>
                New Appointment
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentFilters;
