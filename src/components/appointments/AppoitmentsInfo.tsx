import { useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppointment } from "./hooks/useAppointment";
import { useAuth } from "../../auth/useAuth";
import Layout from "../layout/Layout";

export interface AppointmentRecord {
  appointment_id: number;
  patient: string;
  appointment_date: string;
  status: string;
  doctor?: {
    id: number;
    name: string;
    specialization: string;
  } | null;
  nurse?: {
    id: number;
    name: string;
  } | null;
}

const statusOptions = ["scheduled", "completed", "canceled", "no_show"];

type Props = {
  onAddAppointment: () => void;
};

const AppointmentInfo = ({ onAddAppointment }: Props) => {
  const { user } = useAuth();

  const {
    appointments: records,
    loading,
    error,
    successMsg,
    fetchAppointments,
    deleteAppointment,
    patientSearch,
    setPatientSearch,
    doctorSearch,
    setDoctorSearch,
    statusFilter,
    setStatusFilter,
  } = useAppointment();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const breadcrumbs = [{ label: "Appointments", view: "appointments" }];

  return (
    <Layout crumbs1={breadcrumbs}>
      <Box sx={{ p: 3 }}>
        {/* Filteri */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Typography variant="h5">Appointments</Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              label="Search Patient"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            <TextField
              size="small"
              label="Search Doctor"
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
            />
            <TextField
              size="small"
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>

        {/* Loader */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success message */}
        {successMsg && (
          <Snackbar
            open={!!successMsg}
            autoHideDuration={4000}
            message={successMsg}
          />
        )}

        {/* Table */}
        {!loading && records.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Nurse</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  {user?.role === "admin" && (
                    <TableCell align="right">Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row) => (
                  <TableRow key={row.appointment_id} hover>
                    <TableCell>{row.appointment_id}</TableCell>
                    <TableCell>{row.patient}</TableCell>
                    <TableCell>{row.doctor?.name || "—"}</TableCell>
                    <TableCell>{row.doctor?.specialization || "—"}</TableCell>
                    <TableCell>
                      {row.nurse ? `${row.nurse.name} (#${row.nurse.id})` : "—"}
                    </TableCell>
                    <TableCell>{row.appointment_date}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    {user?.role === "admin" && (
                      <TableCell align="right">
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() =>
                              deleteAppointment(row.appointment_id)
                            }
                          >
                            <DeleteIcon sx={{ color: "#d32f2f" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && records.length === 0 && (
          <Typography sx={{ mt: 3, textAlign: "center" }}>
            Nema termina za prikaz
          </Typography>
        )}
      </Box>
    </Layout>
  );
};

export default AppointmentInfo;
