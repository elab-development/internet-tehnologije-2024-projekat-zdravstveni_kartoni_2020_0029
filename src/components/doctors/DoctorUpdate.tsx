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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const CustomAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const specializations = ["Kardiolog", "Neurolog", "Hirurg", "Pedijatar", "Ortoped"];

const DoctorUpdate: React.FC<Props> = ({ open, doctor, onCancel, onSuccess, updateDoctor }) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [formData, setFormData] = useState({
    name: doctor.user.name,
    email: doctor.user.email,
    specialization: doctor.specialization,
    description: doctor.description || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
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
    setSuccess(null);

    try {
      const result = await updateDoctor(doctor.id, formData);
      if (result.success) {
        setSuccess("Uspešno izmenjeni podaci doktora ✅");
        setShowSnackbar(true);
      } else {
        setError("Izmena nije uspela");
      }
    } catch {
      setError("Greška prilikom izmene doktora");
    } finally {
      setUpdating(false);
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setShowSnackbar(false);
    onSuccess();
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
            label="Specijalizacija"
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

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <CustomAlert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {success}
        </CustomAlert>
      </Snackbar>
    </Dialog>
  );
};

export default DoctorUpdate;




