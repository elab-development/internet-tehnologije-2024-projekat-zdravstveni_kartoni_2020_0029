import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
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
import { api } from "../../auth/api";
import { useAuth } from "../../auth/useAuth";
import PatientsTable, { BackendPatient } from "./PatientsTable";

type Props = {
  onAddPatient: () => void;
};

const Patients: React.FC<Props> = ({ onAddPatient }) => {
  const { user } = useAuth();

  const [patients, setPatients] = useState<BackendPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const patientsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    api
      .get("/patients")
      .then((res) => {
        let raw = res.data;
        if (typeof raw === "string") {
          raw = raw.replace(/^\uFEFF/, "");
          raw = JSON.parse(raw);
        }
        if (raw.success && Array.isArray(raw.data)) {
          setPatients(raw.data);
        } else {
          setError("Nepoznat format odgovora sa servera");
        }
      })
      .catch((err) => {
        console.error("API greška:", err);
        setError("Greška prilikom učitavanja pacijenata");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteClick = (patientId: number) => {
    setPatientToDelete(patientId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (patientToDelete) {
      setPatients((prev) => prev.filter((p) => p.id !== patientToDelete));
    }
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const startIndex = (page - 1) * patientsPerPage;
  const currentPatients = patients.slice(startIndex, startIndex + patientsPerPage);
  const pageCount = Math.ceil(patients.length / patientsPerPage);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje pacijenata...</Typography>
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
        <Typography variant="h4">Patients</Typography>

        {(user?.role === "admin" || user?.role === "doctor") && (
          <Button variant="contained" onClick={onAddPatient}>
            New patient
          </Button>
        )}
      </Box>

      <PatientsTable
        patients={currentPatients}
        onEdit={(p) => console.log("TODO: edit", p)}
        onDelete={handleDeleteClick}
      />

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Patient</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this patient? This action cannot be undone.
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

export default Patients;





