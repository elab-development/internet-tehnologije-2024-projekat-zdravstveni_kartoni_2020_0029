import React from "react";
import { Alert, CircularProgress, Box, Typography, Pagination } from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import { useDoctors } from "./hooks/useDoctors";
import DoctorFilters from "./DoctorFilters";
import DoctorsTable from "./DoctorsTable";
import DeleteDoctorDialog from "./DeleteDoctorDialog";

type Props = {
  onAddDoctor: () => void;
};

const Doctors = ({ onAddDoctor }: Props) => {
  const { user } = useAuth();
  const {
    doctors, loading, error, successMsg,
    page, setPage, totalPages,
    search, setSearch,
    specialization, setSpecialization,
    deleteDialogOpen, doctorToDelete, newDoctorId, setNewDoctorId,
    handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
  } = useDoctors();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje doktora...</Typography>
      </Box>
    );
  }

  return (
    <>
      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <DoctorFilters
        search={search}
        setSearch={setSearch}
        specialization={specialization}
        setSpecialization={setSpecialization}
        onAddDoctor={onAddDoctor}
        user={user}
      />

      <DoctorsTable doctors={doctors} onDelete={handleDeleteClick} />

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

      <DeleteDoctorDialog
        open={deleteDialogOpen}
        doctorId={doctorToDelete}
        newDoctorId={newDoctorId}
        setNewDoctorId={setNewDoctorId}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default Doctors;
