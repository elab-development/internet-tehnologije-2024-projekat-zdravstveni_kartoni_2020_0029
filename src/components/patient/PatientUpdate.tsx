import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Alert,
  MenuItem,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const CustomAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  updatePatient: (id: number, updatedData: any) => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jmbg: "",
    date_of_birth: "",
    gender: "male" as "male" | "female" | "other",
  });

  // kada se promeni pacijent → napuni formu
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.user?.name || "",
        email: patient.user?.email || "",
        jmbg: patient.jmbg,
        date_of_birth: formatDate(patient.date_of_birth),
        gender: patient.gender,
      });
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
    if (!patient) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      await updatePatient(patient.id, formData);
      setSuccess("Uspešno izmenjeni podaci pacijenta ✅");
      setShowSnackbar(true);
    } catch {
      setError("Greška prilikom izmene pacijenta");
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
      <DialogTitle>Izmena pacijenta</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}

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

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <CustomAlert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </CustomAlert>
      </Snackbar>
    </Dialog>
  );
};

export default PatientUpdate;
