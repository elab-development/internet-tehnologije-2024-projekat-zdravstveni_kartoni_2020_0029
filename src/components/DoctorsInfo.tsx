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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../auth/api";
import { useAuth } from "../auth/useAuth";
import AddDoctor from "./AddDoctor"; // 👈 tvoja forma za dodavanje doktora

type BackendDoctor = {
  id: number;
  specialization: string;
  description: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<BackendDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // za modal
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, [page]);

  const fetchDoctors = () => {
    setLoading(true);
    setError(null);

    api
      .get(`/doctors?page=${page}&per_page=8`)
      .then((res) => {
        let raw = res.data;
        if (typeof raw === "string") {
          raw = raw.replace(/^\uFEFF/, "");
          raw = JSON.parse(raw);
        }

        if (raw.success && raw.data?.data) {
          setDoctors(raw.data.data);
          setTotalPages(raw.data.last_page);
        } else {
          setError("Nepoznat format odgovora sa servera");
        }
      })
      .catch((err) => {
        console.error("API greška:", err);
        setError("Greška prilikom učitavanja doktora");
      })
      .finally(() => setLoading(false));
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

        {/* 👇 samo admin vidi dugme */}
        {user?.role === "admin" && (
          <Button variant="contained" onClick={() => setOpenAdd(true)}>
            Add Doctor
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
                <TableCell>{doc.user?.name}</TableCell>
                <TableCell>{doc.user?.email}</TableCell>
                <TableCell>{doc.specialization}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <EditIcon sx={{ color: "#1976d2" }} />
                  </IconButton>
                  <IconButton>
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

      {/* Modal sa formom */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle>Dodaj doktora</DialogTitle>
        <DialogContent>
          <AddDoctor />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} color="error">
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Doctors;

