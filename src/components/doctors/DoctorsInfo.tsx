import React, { useState } from "react";
import { CircularProgress, Box, Typography, Pagination } from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import { useDoctors } from "./hooks/useDoctors";
import DoctorFilters from "./DoctorFilters";
import DoctorsTable from "./DoctorsTable";
import DeleteDoctorDialog from "./DeleteDoctorDialog";
import DoctorUpdate from "./DoctorUpdate";
import Layout from "../layout/Layout";
import PageWrapper from "../PageWrapper";
import { useNotification } from "../notifications/NotificationProvider"; // 👈 koristi hook

const Doctors = ({ onAddDoctor }: { onAddDoctor: () => void }) => {
  const { user } = useAuth();
  const {
    doctors,
    loading,
    error,
    successMsg,
    setSuccessMsg,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    specialization,
    setSpecialization,
    deleteDialogOpen,
    doctorToDelete,
    newDoctorId,
    setNewDoctorId,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    updateDoctor,
  } = useDoctors();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<any>(null);

  // 👇 ubacujemo notify hook
  const { notify } = useNotification();

  const handleEditClick = (doctor: any) => {
    setDoctorToEdit(doctor);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    notify("Doktor uspešno izmenjen", "success");
    setEditDialogOpen(false);
    setDoctorToEdit(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setDoctorToEdit(null);
  };

  const handleDeleteSuccess = () => {
    notify("Doktor uspešno obrisan", "success");
  };

  const handleDeleteError = () => {
    notify("Greška prilikom brisanja doktora", "error");
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
        <Typography sx={{ ml: 2 }}>Učitavanje doktora...</Typography>
      </Box>
    );
  }

  const breadcrumbs: any[] = [{ label: "Doctors", view: "doctor" }];

  return (
    <Layout crumbs1={breadcrumbs}>
      <>
        <DoctorFilters
          search={search}
          setSearch={setSearch}
          specialization={specialization}
          setSpecialization={setSpecialization}
          onAddDoctor={onAddDoctor}
          user={user}
        />

        <PageWrapper>
          <DoctorsTable
            doctors={doctors}
            onDelete={async (id) => {
              try {
                await handleDeleteClick(id);
                handleDeleteSuccess();
              } catch {
                handleDeleteError();
              }
            }}
            onEdit={handleEditClick}
          />
        </PageWrapper>

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
          onConfirm={async () => {
            try {
              await handleDeleteConfirm();
              handleDeleteSuccess();
            } catch {
              handleDeleteError();
            }
          }}
        />

        {doctorToEdit && (
          <DoctorUpdate
            open={editDialogOpen}
            doctor={doctorToEdit}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
            updateDoctor={updateDoctor}
          />
        )}
      </>
    </Layout>
  );
};

export default Doctors;
