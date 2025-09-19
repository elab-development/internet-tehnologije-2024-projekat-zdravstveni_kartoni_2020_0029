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
import { api } from "../../auth/api";

const CustomAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {
  open: boolean;
  onClose: () => void;
  record: any;
  patientId?: number;
  onSuccess: () => void;
};

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];
const allergies = ["Penicilin", "Prašina", "Polen", "Latex", "Jaja", "Mleko"];
const diseases = [
  "Hipertenzija",
  "Dijabetes tip 2",
  "Astma",
  "Hronična bolest pluća",
  "Artritis",
];

const MedicalRecordUpdate: React.FC<Props> = ({
  open,
  onClose,
  record,
  patientId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    blood_type: "",
    allergies: "",
    chronic_diseases: "",
    notes: "",
  });

  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        blood_type: record?.blood_type || "",
        allergies: record?.allergies || "",
        chronic_diseases: record?.chronic_diseases || "",
        notes: record?.notes || "",
      });
    } else {
      setFormData({
        blood_type: "",
        allergies: "",
        chronic_diseases: "",
        notes: "",
      });
    }
  }, [record, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      if (record) {
        await api.put(`/medical-records/${record.id}`, {
          ...record, // ostavi stare vrednosti
          ...formData, // zameni novima
        });
        setSuccess("Zdravstveni karton je uspešno izmenjen ✅");
      } else {
        await api.post(`/medical-records`, {
          patient_id: patientId,
          ...formData,
        });
        setSuccess("Zdravstveni karton je uspešno kreiran ✅");
      }
      setShowSnackbar(true);
    } catch {
      setError("Greška prilikom izmene/kreiranja kartona");
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {record
          ? "Izmena zdravstvenog kartona"
          : "Kreiranje zdravstvenog kartona"}
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}

        {/* Krvna grupa */}
        <TextField
          select
          label="Krvna grupa"
          name="blood_type"
          fullWidth
          value={formData.blood_type}
          onChange={handleChange}
          margin="normal"
          SelectProps={{
            renderValue: (selected) =>
              selected !== "" ? (
                selected
              ) : (
                <span style={{ color: "#888" }}>
                  {record?.blood_type || "Odaberi krvnu grupu"}
                </span>
              ),
          }}
        >
          {bloodTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {/* Alergije */}
        <TextField
          select
          label="Alergije"
          name="allergies"
          fullWidth
          value={formData.allergies}
          onChange={handleChange}
          margin="normal"
          SelectProps={{
            renderValue: (selected) =>
              selected !== "" ? (
                selected
              ) : (
                <span style={{ color: "#888" }}>
                  {record?.allergies || "Odaberi alergiju"}
                </span>
              ),
          }}
        >
          {allergies.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </TextField>

        {/* Hronične bolesti */}
        <TextField
          select
          label="Hronične bolesti"
          name="chronic_diseases"
          fullWidth
          value={formData.chronic_diseases}
          onChange={handleChange}
          margin="normal"
          SelectProps={{
            renderValue: (selected) =>
              selected !== "" ? (
                selected
              ) : (
                <span style={{ color: "#888" }}>
                  {record?.chronic_diseases || "Odaberi bolest"}
                </span>
              ),
          }}
        >
          {diseases.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>

        {/* Napomene */}
        <TextField
          label="Napomene"
          name="notes"
          fullWidth
          multiline
          minRows={3}
          value={formData.notes}
          onChange={handleChange}
          margin="normal"
          placeholder={record?.notes || "Unesi napomene"}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={updating}
        >
          {record ? "Sačuvaj izmene" : "Kreiraj"}
        </Button>
        <Button variant="outlined" onClick={onClose} disabled={updating}>
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

export default MedicalRecordUpdate;
