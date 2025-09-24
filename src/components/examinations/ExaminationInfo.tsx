import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { useExaminations } from "./hooks/useExaminations";
import ExaminationsTable from "./ExaminationsTable";
import Layout from "../layout/Layout";
import { useAuth } from "../../auth/useAuth";
import PageWrapper from "../PageWrapper";
import { useNotification } from "../notifications/NotificationProvider";

const ExaminationInfo: React.FC = () => {
  const { medicalRecordId } = useParams<{ medicalRecordId?: string }>();

  const recordId =
    medicalRecordId && !isNaN(Number(medicalRecordId))
      ? Number(medicalRecordId)
      : null;

  const {
    examinations,
    loading,
    error,
    successMsg,
    page,
    setPage,
    totalPages,
    fetchExaminations,
    updateExamination,
    deleteExamination,
  } = useExaminations(recordId);

  const { user } = useAuth();
  const { notify } = useNotification();

  useEffect(() => {
    fetchExaminations();
  }, [page, fetchExaminations]);

  useEffect(() => {
    if (error) notify(error, "error");
  }, [error, notify]);

  useEffect(() => {
    if (successMsg) notify(successMsg, "success");
  }, [successMsg, notify]);

  const breadcrumbs =
    recordId !== null
      ? user?.role === "patient"
        ? [
            {
              label: "Medical Record",
              view: `patients/medical-record/${recordId}`,
            },
            { label: "Examinations", view: `` },
          ]
        : [
            { label: "Patients", view: "patients" },
            {
              label: "Medical Record",
              view: `patients/medical-record/${recordId}`,
            },
            { label: "Examinations", view: `` },
          ]
      : [{ label: "Examinations", view: `` }];

  return (
    <Layout crumbs1={breadcrumbs}>
      <Box sx={{ p: 1 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && !error && (
          <PageWrapper>
            <ExaminationsTable
              examinations={examinations}
              loading={loading}
              error={null}
              successMsg={null}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              onUpdate={async (id, data) => {
                const success = await updateExamination(id, data);
                if (success) notify("Pregled uspešno izmenjen");
                return success;
              }}
              onDelete={async (id) => {
                await deleteExamination(id);
                notify("Pregled uspešno obrisan", "success");
              }}
              medicalRecordId={medicalRecordId}
              userRole={user?.role}
            />
          </PageWrapper>
        )}
      </Box>
    </Layout>
  );
};

export default ExaminationInfo;
