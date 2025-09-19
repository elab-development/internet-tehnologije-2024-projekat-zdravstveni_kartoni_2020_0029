// DoctorUpdate.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface Doctor {
  id: number;
  user: {
    name: string;
    email: string;
  };
  specialization: string;
  description?: string;
}

type Props = {
  open: boolean;
  doctor: Doctor;
  onCancel: () => void;
  onSuccess: () => void;
  updateDoctor: (id: number, updatedData: any) => Promise<{ success: boolean }>;
};

const specializations = [
  "Kardiolog",
  "Neurolog",
  "Hirurg",
  "Pedijatar",
  "Ortoped",
];

const DoctorUpdate: React.FC<Props> = ({
  open,
  doctor,
  onCancel,
  onSuccess,
  updateDoctor,
}) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: doctor.user.name,
    email: doctor.user.email,
    specialization: doctor.specialization,
    description: doctor.description || "",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSubmit = async () => {
    setUpdating(true);
    setError(null);

    try {
      const result = await updateDoctor(doctor.id, formData);
      if (result.success) {
        // 🔥 globalni snackbar
        window.dispatchEvent(
          new CustomEvent("notify", {
            detail: {
              type: "success",
              message: "Uspešno izmenjeni podaci doktora ✅",
            },
          })
        );
        onSuccess(); // zatvara modal
      } else {
        window.dispatchEvent(
          new CustomEvent("notify", {
            detail: { type: "error", message: "Izmena doktora nije uspela ❌" },
          })
        );
      }
    } catch {
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: "Greška prilikom izmene doktora ❌",
          },
        })
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Izmena podataka doktora</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Ime"
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

        <FormControl fullWidth margin="normal">
          <InputLabel id="spec-label">Specijalizacija</InputLabel>
          <Select
            labelId="spec-label"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          >
            {specializations.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Opis"
          name="description"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          margin="normal"
        />
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

export default DoctorUpdate;
