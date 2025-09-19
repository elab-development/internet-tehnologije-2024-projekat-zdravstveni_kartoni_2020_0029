// src/components/patient/PatientUpdate.tsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface Patient {
  id: number;
  jmbg: string;
  gender: "male" | "female" | "other";
  date_of_birth: string;
  user?: {
    name: string;
    email: string;
  };
}

type Props = {
  open: boolean;
  patient: Patient | null;
  onCancel: () => void;
  onSuccess: () => void;
  updatePatient: (
    id: number,
    updatedData: any
  ) => Promise<{ success: boolean; data?: any }>;
};

// helper da formatira ISO datum u yyyy-MM-dd
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const PatientUpdate: React.FC<Props> = ({
  open,
  patient,
  onCancel,
  onSuccess,
  updatePatient,
}) => {
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jmbg: "",
    date_of_birth: "",
    gender: "male" as "male" | "female" | "other",
  });

  // čuvamo originalne vrednosti radi poređenja
  const [originalData, setOriginalData] = useState<typeof formData | null>(
    null
  );

  // kada se promeni pacijent → napuni formu
  useEffect(() => {
    if (patient) {
      const initial = {
        name: patient.user?.name || "",
        email: patient.user?.email || "",
        jmbg: patient.jmbg,
        date_of_birth: formatDate(patient.date_of_birth),
        gender: patient.gender,
      };
      setFormData(initial);
      setOriginalData(initial);
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!patient || !originalData) return;

    setUpdating(true);

    try {
      // 🔥 šaljemo samo izmenjena polja
      const updatedData: any = {};
      Object.keys(formData).forEach((key) => {
        const k = key as keyof typeof formData;
        if (formData[k] !== originalData[k]) {
          updatedData[k] = formData[k];
        }
      });

      if (Object.keys(updatedData).length === 0) {
        // ništa nije promenjeno
        onCancel();
        return;
      }

      const result = await updatePatient(patient.id, updatedData);

      if (result.success) {
        onSuccess(); // 👈 uspešan update
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Izmena pacijenta</DialogTitle>
      <DialogContent>
        <TextField
          label="Ime i prezime"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="JMBG"
          name="jmbg"
          fullWidth
          value={formData.jmbg}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Datum rođenja"
          name="date_of_birth"
          type="date"
          fullWidth
          value={formData.date_of_birth}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Pol"
          name="gender"
          fullWidth
          value={formData.gender}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="male">Muški</MenuItem>
          <MenuItem value="female">Ženski</MenuItem>
          <MenuItem value="other">Drugo</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={updating}
        >
          Sačuvaj izmene
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={updating}>
          Otkaži
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientUpdate;
