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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../auth/api";
import { useAuth } from "../auth/useAuth";

type BackendDoctor = {
  id: number;
  specialization: string;
  description: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

type Props = {
  onAddDoctor: () => void;
};

const Doctors = ({ onAddDoctor }: Props) => {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState<BackendDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/doctors?page=${page}&per_page=8`)
      .then((res) => {
        let raw = res.data;
        if (typeof raw === "string") {
          raw = raw.replace(/^\uFEFF/, "");
          raw = JSON.parse(raw);
        }

        if (raw.success && Array.isArray(raw.data?.data)) {
          setDoctors(raw.data.data);
          setTotalPages(raw.data.last_page || 1);
        } else {
          setError("Nepoznat format odgovora sa servera");
        }
      })
      .catch((err) => {
        console.error("API greška:", err);
        setError("Greška prilikom učitavanja doktora");
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleDeleteClick = (doctorId: number) => {
    setDoctorToDelete(doctorId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (doctorToDelete) {
      setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete));
    }
    setDeleteDialogOpen(false);
    setDoctorToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDoctorToDelete(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje doktora...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          userSelect: "none",
        }}
      >
        <Typography variant="h4">Doctors</Typography>

        {(user?.role === "admin" || user?.role === "doctor") && (
          <Button variant="contained" onClick={onAddDoctor}>
            New Doctor
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doc) => (
              <TableRow key={doc.id} hover>
                <TableCell>{doc.user?.name || "N/A"}</TableCell>
                <TableCell>{doc.user?.email || "N/A"}</TableCell>
                <TableCell>{doc.specialization}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <EditIcon sx={{ color: "#1976d2" }} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(doc.id)}>
                    <DeleteIcon sx={{ color: "#d32f2f" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Doctor</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this doctor? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Doctors;





