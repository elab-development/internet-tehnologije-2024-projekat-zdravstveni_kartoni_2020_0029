import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const statusOptions = ["scheduled", "completed", "canceled", "no_show"];

type AppointmentTableProps = {
  records: any[];
  user: { role?: string } | null;
  updateAppointment: (id: number, data: { status?: string }) => void;
  deleteAppointment: (id: number) => void;
};

const AppointmentTable = ({
  records,
  user,
  updateAppointment,
  deleteAppointment,
}: AppointmentTableProps) => {
  const canDelete = user?.role === "admin" || user?.role === "nurse";
  const canEditStatus =
    user?.role === "admin" || user?.role === "nurse" || user?.role === "doctor";

  // 📌 Lokalna paginacija
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const paginatedRecords = records.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // 📌 Confirm dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpenDialog = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedId(null);
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      deleteAppointment(selectedId);
    }
    handleCloseDialog();
  };

  return (
    <>
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
              {canDelete && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((row) => (
              <TableRow key={row.appointment_id} hover>
                <TableCell>{row.appointment_id}</TableCell>
                <TableCell>{row.patient}</TableCell>
                <TableCell>{row.doctor?.name || "—"}</TableCell>
                <TableCell>{row.doctor?.specialization || "—"}</TableCell>
                <TableCell>{row.nurse ? `${row.nurse.name}` : "—"}</TableCell>
                <TableCell>{row.appointment_date}</TableCell>
                <TableCell>
                  {canEditStatus ? (
                    <Select
                      size="small"
                      value={row.status}
                      onChange={(e) =>
                        updateAppointment(row.appointment_id, {
                          status: e.target.value,
                        })
                      }
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    row.status
                  )}
                </TableCell>
                {canDelete && (
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog(row.appointment_id)}
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

      {/* 📌 Pagination control */}
      {records.length > rowsPerPage && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(records.length / rowsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* 📌 Confirm delete dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Potvrda brisanja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Da li ste sigurni da želite da obrišete ovaj termin?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Otkaži
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Obriši
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentTable;
