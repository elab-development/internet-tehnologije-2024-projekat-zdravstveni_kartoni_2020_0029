import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import { usePatients } from "./hooks/usePatients";

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients } = usePatients();

  const patient = patients.find((p) => p.id === Number(id));

  if (!patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Pacijent nije pronađen.</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => navigate("/patients")}
        >
          ← Nazad na listu
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={() => navigate("/patients")}
      >
        ← Nazad na listu pacijenata
      </Button>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Detalji pacijenta
        </Typography>
        <Typography>
          <b>ID:</b> {patient.id}
        </Typography>
        <Typography>
          <b>Ime:</b> {patient.user?.name || "N/A"}
        </Typography>
        <Typography>
          <b>Email:</b> {patient.user?.email || "N/A"}
        </Typography>
        <Typography>
          <b>JMBG:</b> {patient.jmbg}
        </Typography>
        <Typography>
          <b>Pol:</b> {patient.gender}
        </Typography>
        <Typography>
          <b>Krvna grupa:</b> {patient.medical_record?.blood_type || "N/A"}
        </Typography>
        <Typography>
          <b>Doktor:</b> {patient.medical_record?.doctor?.user?.name || "N/A"}
        </Typography>
      </Paper>
    </Box>
  );
};

export default PatientPage;
