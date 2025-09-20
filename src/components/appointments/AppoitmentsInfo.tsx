import React, { useEffect, useState } from "react";
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
  Pagination,
  TextField,
  MenuItem,
  Snackbar,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppointment } from "./hooks/useAppointment";
import AppointmentFilters from "./AppointmentFilter";
import { useAuth } from "../../auth/useAuth";
import Layout from "../layout/Layout";

// ➕ dodali smo polje doctor
export interface AppointmentRecord {
  appointment_id: number;
  patient: string;
  doctor?: {
    id: number;
    name: string;
    specialization: string;
  } | null;
  scheduled_by: string;
  appointment_date: string;
  status: string;
}

const statusOptions = ["scheduled", "completed", "canceled", "no_show"];

type Props = {
  onAddAppointment: () => void;
};

const AppoitmentInfo = ({ onAddAppointment }: Props) => {
  const { user } = useAuth();

  const {
    appointments: records,
    loading,
    error,
    fetchAppointments,
    updateAppointment,
    successMsg,
    deleteAppointment,
    patientSearch,
    setPatientSearch,
    statusFilter,
    setStatusFilter,
  } = useAppointment();

  const [page, setPage] = useState(1);
  const perPage = 8;

  const [editingId, setEditingId] = useState<number | null>(null);
  const [localStatus, setLocalStatus] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const startIndex = (page - 1) * perPage;
  const currentRecords = records?.slice(startIndex, startIndex + perPage) || [];
  const pageCount = Math.ceil((records?.length || 0) / perPage);

  const handleStatusClick = (record: AppointmentRecord) => {
    setEditingId(record.appointment_id);
    setLocalStatus(record.status);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setLocalStatus(newStatus);
    await updateAppointment(id, { status: newStatus });
    setEditingId(null);
    setShowSuccess(true);
    fetchAppointments();
  };

  const handleDeleteClick = (id: number) => {
    setAppointmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (appointmentToDelete) {
      await deleteAppointment(appointmentToDelete);
      setShowSuccess(true);
      fetchAppointments();
    }
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje termina...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const breadcrumbs: any[] = [{ label: "Appointments", view: "appointments" }];

  return (
    <Layout crumbs1={breadcrumbs}>
      <>
        <AppointmentFilters
          search={patientSearch}
          setSearch={setPatientSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
          onAddAppointment={onAddAppointment}
          user={user}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell> {/* ➕ nova kolona */}
                <TableCell>Scheduled By</TableCell>
                <TableCell>Appointment Date</TableCell>
                <TableCell>Status</TableCell>
                {user?.role !== "patient" && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRecords.map((record) => (
                <TableRow key={record.appointment_id} hover>
                  <TableCell>{record.appointment_id}</TableCell>
                  <TableCell>{record.patient}</TableCell>
                  <TableCell>
                    {record.doctor
                      ? `${record.doctor.name} (${record.doctor.specialization})`
                      : "Nepoznat"}
                  </TableCell>
                  <TableCell>{record.scheduled_by}</TableCell>
                  <TableCell>
                    {new Date(record.appointment_date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {editingId === record.appointment_id ? (
                      <TextField
                        select
                        size="small"
                        value={localStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            record.appointment_id,
                            e.target.value
                          )
                        }
                        autoFocus
                      >
                        {statusOptions.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <Box
                        onClick={() =>
                          user?.role !== "patient" && handleStatusClick(record)
                        }
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          cursor:
                            user?.role !== "patient" ? "pointer" : "default",
                          backgroundColor:
                            record.status === "completed"
                              ? "success.main"
                              : record.status === "scheduled"
                              ? "info.main"
                              : record.status === "canceled"
                              ? "error.main"
                              : "warning.main",
                          color: "common.white",
                        }}
                      >
                        {record.status}
                      </Box>
                    )}
                  </TableCell>

                  {user?.role !== "patient" && (
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() =>
                              handleDeleteClick(record.appointment_id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {pageCount > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}

        <Snackbar
          open={showSuccess && !!successMsg}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            onClose={() => setShowSuccess(false)}
            sx={{ width: "100%" }}
          >
            {successMsg || "Action executed successfully ✅"}
          </Alert>
        </Snackbar>

        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Potvrda brisanja</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Da li ste sigurni da želite da obrišete ovaj termin? Ova akcija je
              nepovratna.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Odustani</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Obriši
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </Layout>
  );
};

export default AppoitmentInfo;
