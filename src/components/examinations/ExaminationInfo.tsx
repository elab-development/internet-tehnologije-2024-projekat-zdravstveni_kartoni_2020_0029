import React, { useEffect } from "react";
import { Box, CircularProgress, Paper, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { useExaminations } from "./hooks/useExaminations";
import ExaminationsTable from "./ExaminationsTable";
import Layout from "../layout/Layout";
import { useAuth } from "../../auth/useAuth";

const ExaminationInfo: React.FC = () => {
  const { medicalRecordId } = useParams<{ medicalRecordId: string }>();

  const {
    examinations,
    loading,
    error,
    successMsg,
    page,
    setPage,
    totalPages,
    fetchExaminations,
    updateExamination, // ✅ sada koristimo hook
    deleteExamination,
  } = useExaminations(medicalRecordId ? Number(medicalRecordId) : null);

  useEffect(() => {
    fetchExaminations();
  }, [page, fetchExaminations]);

  const { user } = useAuth();

  const breadcrumbs =
    user?.role === "patient"
      ? [
          {
            label: "Medical Record",
            view: `patients/medical-record/${medicalRecordId}`,
          },
          { label: "Examinations", view: `` },
        ]
      : [
          { label: "Patients", view: "patients" },
          {
            label: "Medical Record",
            view: `patients/medical-record/${medicalRecordId}`,
          },
          { label: "Examinations", view: `` },
        ];

  return (
    <Layout crumbs1={breadcrumbs}>
      <Box sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Paper>
        )}

        {successMsg && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Alert severity="success">{successMsg}</Alert>
          </Paper>
        )}

        {!loading && !error && (
          <ExaminationsTable
            examinations={examinations}
            loading={loading}
            error={error}
            successMsg={successMsg}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            onUpdate={updateExamination}
            onDelete={deleteExamination}
            medicalRecordId={medicalRecordId}
            userRole={user?.role}
          />
        )}
      </Box>
    </Layout>
  );
};

export default ExaminationInfo;
