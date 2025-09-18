import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { BackendPatient } from "../patient/PatientsTable";

type Props = {
  open: boolean;
  patient: BackendPatient | null;
  onClose: () => void;
};

const PatientDialog: React.FC<Props> = ({ open, patient, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalji pacijenta</DialogTitle>
      <DialogContent dividers>
        {patient ? (
          <Box>
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
              <b>Doktor:</b>{" "}
              {patient.medical_record?.doctor?.user?.name || "N/A"}
            </Typography>
          </Box>
        ) : (
          <Typography>Nema podataka o pacijentu.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDialog;
