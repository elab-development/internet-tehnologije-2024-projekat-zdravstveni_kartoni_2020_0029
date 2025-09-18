import React, { useState, useEffect } from "react";
import {
  Alert,
  CircularProgress,
  Box,
  Typography,
  Pagination,
  Button,
  Paper,
} from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import { usePatients } from "./hooks/usePatients";
import { useRecords } from "../medicalRecord/hooks/useRecords"; // 👈 hook za kartone
import PatientFilters from "./PatientFilters";
import PatientsTable from "./PatientsTable";
import DeletePatientDialog from "./DeletePatientDialog";
import PatientUpdate from "./PatientUpdate";
import MedicalRecordInfo from "../medicalRecord/MedicalRecordInfo";
import Layout from "../layout/Layout";

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

  const {
    record,
    loading: recordLoading,
    error: recordError,
    fetchRecord,
  } = useRecords();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>();

  const handleEditClick = (patient: any) => {
    setPatientToEdit(patient);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setPatientToEdit(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setPatientToEdit(null);
  };

  // kad klikneš na pacijenta → povuci karton
  useEffect(() => {
    if (selectedPatientId) {
      fetchRecord(selectedPatientId);
    }
  }, [selectedPatientId]);

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

  const breadcrumbs: any[] = [];
  return (
    <Layout crumbs1={breadcrumbs}>
      <>
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Ako je odabran pacijent, prikaži njegov karton */}
        {selectedPatientId ? (
          <Box sx={{ p: 2 }}>
            <Button
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={() => setSelectedPatientId(null)}
            >
              ← Nazad na listu pacijenata
            </Button>

            {recordLoading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Učitavanje kartona...</Typography>
              </Box>
            )}

            {recordError && <Alert severity="error">{recordError}</Alert>}

            {!recordLoading && !recordError && record && (
              <MedicalRecordInfo
                record={record}
                onEdit={() => handleEditClick(record?.patient)}
              />
            )}
          </Box>
        ) : (
          <>
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
              onEdit={handleEditClick}
              onSelect={(id) => setSelectedPatientId(id)} // 👈 sada radi
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
          </>
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
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
            updatePatient={updatePatient}
          />
        )}
      </>
    </Layout>
  );
};

export default Patients;
