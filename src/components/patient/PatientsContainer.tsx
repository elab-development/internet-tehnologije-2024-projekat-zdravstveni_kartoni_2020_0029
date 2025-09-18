import React, { useState, useEffect } from "react";
import PatientsTable, { BackendPatient } from "./PatientsTable";
import MedicalRecordInfo from "../medicalRecord/MedicalRecordInfo";
import MedicalRecordUpdate from "../medicalRecord/MedicalRecordUpdate";
import { usePatients } from "./hooks/usePatients";
import { useRecords } from "../medicalRecord/hooks/useRecords";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Pagination,
  Stack,
} from "@mui/material";

type Props = {
  onAddPatient: () => void;
  onSelectPatient?: (id: number) => void;
  selectedPatientId?: number | null;
};

const PatientsContainer: React.FC<Props> = ({
  onAddPatient,
  onSelectPatient,
  selectedPatientId: externalSelectedId,
}) => {
  const {
    patients,
    loading: patientsLoading,
    error: patientsError,
    fetchPatients,
    page,
    setPage,
    totalPages,
  } = usePatients();

  const {
    record,
    loading: recordLoading,
    error: recordError,
    fetchRecord,
  } = useRecords();

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    externalSelectedId || null
  );

  const [editOpen, setEditOpen] = useState(false); // ⬅️ Dodato za modal

  useEffect(() => {
    fetchPatients();
  }, [page]);

  useEffect(() => {
    if (selectedPatientId) {
      fetchRecord(selectedPatientId);
    }
  }, [selectedPatientId]);

  const handleBack = () => {
    setSelectedPatientId(null);
    if (onSelectPatient) onSelectPatient(0);
  };

  const handleEditOpen = () => setEditOpen(true); // ⬅️ Otvori modal
  const handleEditClose = () => setEditOpen(false); // ⬅️ Zatvori modal

  return (
    <Box sx={{ p: 3 }}>
      {selectedPatientId ? (
        <Box>
          <Button variant="outlined" sx={{ mb: 2 }} onClick={handleBack}>
            ← Nazad na pacijente
          </Button>

          {recordLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {recordError && (
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#ffe6e6", mt: 2 }}>
              <Typography color="error" align="center">
                {recordError}
              </Typography>
            </Paper>
          )}

          {!recordLoading && !recordError && record && (
            <>
              <MedicalRecordInfo record={record} onEdit={handleEditOpen} />

              <MedicalRecordUpdate
                open={editOpen}
                onClose={handleEditClose}
                record={record}
                onSuccess={() => {
                  fetchRecord(record.patient_id);
                  setEditOpen(false);
                }}
              />
            </>
          )}
        </Box>
      ) : (
        <Box>
          {patientsLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {patientsError && (
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#ffe6e6", mt: 2 }}>
              <Typography color="error" align="center">
                {patientsError}
              </Typography>
            </Paper>
          )}

          {!patientsLoading && !patientsError && (
            <>
              <PatientsTable
                patients={patients}
                onEdit={(p: BackendPatient) =>
                  console.log("Edit patient:", p)
                }
                onDelete={(id: number) =>
                  console.log("Delete patient:", id)
                }
                onSelect={(id: number) => {
                  setSelectedPatientId(id);
                  if (onSelectPatient) onSelectPatient(id);
                }}
              />

              {totalPages > 1 && (
                <Stack
                  spacing={2}
                  sx={{ display: "flex", alignItems: "center", mt: 3 }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Stack>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PatientsContainer;

