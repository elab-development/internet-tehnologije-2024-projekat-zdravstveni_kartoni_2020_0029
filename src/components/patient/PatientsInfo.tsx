import React, { useState, useEffect } from "react";
import { CircularProgress, Box, Typography, Pagination } from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import { usePatients } from "./hooks/usePatients";
import PatientFilters from "./PatientFilters";
import PatientsTable, { BackendPatient } from "./PatientsTable";
import DeletePatientDialog from "./DeletePatientDialog";
import PatientUpdate from "./PatientUpdate";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import Notification from "../Notifications";

const Patients = ({ onAddPatient }: { onAddPatient: () => void }) => {
  const { user } = useAuth();
  const {
    patients,
    loading,
    error,
    successMsg,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    specialization,
    setSpecialization,
    deleteDialogOpen,
    patientToDelete,
    newPatientId,
    setNewPatientId,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    updatePatient,
    doctorSearch,
    setDoctorSearch,
  } = usePatients();

  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<BackendPatient | null>(
    null
  );

  // 📢 notifications
  const { message, type, notifySuccess, notifyError, clear } =
    useNotifications();

  useEffect(() => {
    if (successMsg) notifySuccess(successMsg);
    if (error) notifyError(error);
  }, [successMsg, error]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje pacijenata...</Typography>
      </Box>
    );
  }

  const breadcrumbs: any[] = [{ label: "Patients", view: "patients" }];

  return (
    <Layout crumbs1={breadcrumbs}>
      <>
        {/* 🔔 Globalna notifikacija */}
        <Notification message={message} type={type} onClose={clear} />

        <PatientFilters
          search={search}
          setSearch={setSearch}
          specialization={specialization}
          setSpecialization={setSpecialization}
          onAddPatient={onAddPatient}
          user={user}
          doctorSearch={doctorSearch}
          setDoctorSearch={setDoctorSearch}
        />

        <PatientsTable
          patients={patients}
          onDelete={handleDeleteClick}
          onEdit={(p) => {
            setPatientToEdit(p);
            setEditDialogOpen(true);
          }}
          onSelect={(id: number) => {
            navigate(`/patients/medical-record/${id}`);
          }}
        />

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

        <DeletePatientDialog
          open={deleteDialogOpen}
          patientId={patientToDelete}
          newPatientId={newPatientId}
          setNewPatientId={setNewPatientId}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />

        {patientToEdit && (
          <PatientUpdate
            open={editDialogOpen}
            patient={patientToEdit}
            onCancel={() => {
              setEditDialogOpen(false);
              setPatientToEdit(null);
            }}
            onSuccess={() => {
              setEditDialogOpen(false);
              setPatientToEdit(null);
            }}
            updatePatient={updatePatient}
          />
        )}
      </>
    </Layout>
  );
};

export default Patients;
