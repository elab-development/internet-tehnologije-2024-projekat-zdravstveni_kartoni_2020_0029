// src/components/examinations/AddExamination.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import { useExaminations } from "./hooks/useExaminations";
import { useNotification } from "../notifications/NotificationProvider";

type Props = {
  onSuccess?: () => void;
};

const AddExamination: React.FC<Props> = ({ onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { medicalRecordId } = useParams<{ medicalRecordId: string }>();
  const { addExamination, loading, error, fetchExaminations } = useExaminations(
    medicalRecordId ? Number(medicalRecordId) : null
  );

  const { notify } = useNotification();

  const [form, setForm] = useState({
    symptom_description: "",
    diagnosis: "",
    therapy: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!medicalRecordId) {
      notify("Medical record ID is missing", "error");
      return;
    }

    const success = await addExamination({
      medical_record_id: Number(medicalRecordId),
      symptom_description: form.symptom_description,
      diagnosis: form.diagnosis,
      therapy: form.therapy,
    });

    if (success) {
      notify("Examination successfully created!", "success");
      fetchExaminations();

      if (onSuccess) onSuccess();

      setTimeout(() => {
        navigate(`/medical-records/${medicalRecordId}/examinations`);
      }, 1500);
    } else if (error) {
      notify(error, "error");
    }
  };

  const breadcrumbs = medicalRecordId
    ? user?.role === "patient"
      ? [
          {
            label: "Medical Record",
            view: `patients/medical-record/${medicalRecordId}`,
          },
          {
            label: "Examinations",
            view: `medical-records/${medicalRecordId}/examinations`,
          },
          { label: "New examination", view: `` },
        ]
      : [
          { label: "Patients", view: "patients" },
          {
            label: "Medical Record",
            view: `patients/medical-record/${medicalRecordId}`,
          },
          {
            label: "Examinations",
            view: `medical-records/${medicalRecordId}/examinations`,
          },
          { label: "New examination", view: `` },
        ]
    : [
        { label: "Examinations", view: "examinations" },
        { label: "New examination", view: `` },
      ];

  return (
    <Layout crumbs1={breadcrumbs}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
          <Typography variant="h5" mb={3}>
            New Examination
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Symptoms"
              name="symptom_description"
              value={form.symptom_description}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              label="Diagnosis"
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            <TextField
              label="Therapy"
              name="therapy"
              value={form.therapy}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(`/medical-records/${medicalRecordId}/examinations`)
                }
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AddExamination;
