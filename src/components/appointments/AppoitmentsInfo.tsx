import { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppointment } from "./hooks/useAppointment";
import AppointmentFilters from "./AppointmentFilter";
import { useAuth } from "../../auth/useAuth";

export interface AppointmentRecord {
  appointment_id: number;
  patient: string;
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

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AppointmentRecord | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // dialog za brisanje
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const startIndex = (page - 1) * perPage;
  const currentRecords = records?.slice(startIndex, startIndex + perPage) || [];
  const pageCount = Math.ceil((records?.length || 0) / perPage);

  const handleOpenEdit = (record: AppointmentRecord) => {
    setSelectedRecord(record);
    setNewStatus(record.status);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedRecord(null);
    setNewStatus("");
  };

  const handleSaveStatus = async () => {
    if (!selectedRecord) return;
    await updateAppointment(selectedRecord.appointment_id, { status: newStatus });
    setShowSuccess(true);
    handleCloseEdit();
    fetchAppointments();
  };

  const handleOpenDelete = (id: number) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setDeleteId(null);
    setOpenDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteAppointment(deleteId);
      setShowSuccess(true);
      fetchAppointments();
    }
    handleCloseDelete();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje termina...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
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
              <TableCell>Scheduled By</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record) => (
              <TableRow key={record.appointment_id} hover>
                <TableCell>{record.appointment_id}</TableCell>
                <TableCell>{record.patient}</TableCell>
                <TableCell>{record.scheduled_by}</TableCell>
                <TableCell>{new Date(record.appointment_date).toLocaleString()}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
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
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEdit(record)}>
                    <EditIcon sx={{ color: "#1976d2" }} />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDelete(record.appointment_id)}>
                    <DeleteIcon sx={{ color: "#d32f2f" }} />
                  </IconButton>
                </TableCell>
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

      {/* Edit dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Appointment Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            margin="normal"
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveStatus} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Da li ste sigurni da želite da obrišete ovaj termin?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            sx={{ color: "error.main" }}   // 👈 samo tekst crven
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar za uspeh */}
      <Snackbar
        open={showSuccess && !!successMsg}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)} sx={{ width: "100%" }}>
          {successMsg || "Action executed successfully ✅"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppoitmentInfo;
