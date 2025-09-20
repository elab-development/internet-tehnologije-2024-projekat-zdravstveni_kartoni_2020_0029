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
import { useRecords } from "./hooks/useRecords"; // 👈 nova kuka

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

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
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
  const { updateRecord, fetchRecord, successMsg, error, loading } =
    useRecords();

  const [formData, setFormData] = useState({
    blood_type: "",
    allergies: [] as string[],
    chronic_diseases: [] as string[],
    notes: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);

  // kada se otvori dijalog, popuni formu
  useEffect(() => {
    if (record) {
      setFormData({
        blood_type: record?.blood_type || "",
        allergies: record?.allergies || [],
        chronic_diseases: record?.chronic_diseases || [],
        notes: record?.notes || "",
      });
    } else {
      setFormData({
        blood_type: "",
        allergies: [],
        chronic_diseases: [],
        notes: "",
      });
    }
  }, [record, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleSubmit = async () => {
    if (record) {
      // update postojećeg kartona
      await updateRecord(record.id, formData);
    } else {
      // ako želiš da admin/doktor može kreirati karton ručno → backend route POST treba da postoji
      console.warn("❗ Kreiranje kartona ide kroz /patients store logiku");
    }

    setShowSnackbar(true);
    onSuccess();
    if (record) {
      // ponovo učitaj karton
      fetchRecord(record.id);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
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
          SelectProps={{
            multiple: true,
            value: formData.allergies,
            onChange: (e) =>
              handleMultiSelectChange("allergies", e.target.value as string[]),
          }}
          margin="normal"
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
          SelectProps={{
            multiple: true,
            value: formData.chronic_diseases,
            onChange: (e) =>
              handleMultiSelectChange(
                "chronic_diseases",
                e.target.value as string[]
              ),
          }}
          margin="normal"
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
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {record ? "Sačuvaj izmene" : "Kreiraj"}
        </Button>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Otkaži
        </Button>
      </DialogActions>

      <Snackbar
        open={showSnackbar && !!successMsg}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <CustomAlert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMsg}
        </CustomAlert>
      </Snackbar>
    </Dialog>
  );
};

export default MedicalRecordUpdate;
