import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { api } from "../../auth/api";

type Props = {
  open: boolean;
  onClose: () => void;
  record: any;
  patientId?: number;
  onSuccess: () => void;
};

const MedicalRecordUpdate: React.FC<Props> = ({ open, onClose, record, patientId, onSuccess }) => {
  const [form, setForm] = useState({
    blood_type: "",
    allergies: "",
    chronic_diseases: "",
    notes: "",
  });

  useEffect(() => {
    if (record) {
      setForm({
        blood_type: record.blood_type || "",
        allergies: record.allergies || "",
        chronic_diseases: record.chronic_diseases || "",
        notes: record.notes || "",
      });
    } else {
      setForm({
        blood_type: "",
        allergies: "",
        chronic_diseases: "",
        notes: "",
      });
    }
  }, [record, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (record) {
        await api.put(`/medical-records/${record.id}`, form);
      } else {
        await api.post(`/medical-records`, {
          patient_id: patientId,
          ...form,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Greška pri (izmeni/kreiranju) kartona:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{record ? "Izmena zdravstvenog kartona" : "Kreiranje zdravstvenog kartona"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Krvna grupa"
          name="blood_type"
          fullWidth
          margin="normal"
          value={form.blood_type}
          onChange={handleChange}
        />
        <TextField
          label="Alergije"
          name="allergies"
          fullWidth
          margin="normal"
          value={form.allergies}
          onChange={handleChange}
        />
        <TextField
          label="Hronične bolesti"
          name="chronic_diseases"
          fullWidth
          margin="normal"
          value={form.chronic_diseases}
          onChange={handleChange}
        />
        <TextField
          label="Napomene"
          name="notes"
          fullWidth
          margin="normal"
          value={form.notes}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Otkaži</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {record ? "Sačuvaj" : "Kreiraj"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicalRecordUpdate;
