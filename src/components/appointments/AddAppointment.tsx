import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Alert,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { usePatients } from "../patient/hooks/usePatients";
import { useAppointment } from "./hooks/useAppointment";
import { useAuth } from "../../auth/useAuth"; // 👈 da dobijemo user_id iz login-a

type Props = {
  onCancel: () => void;
  onSuccess: () => void;
};

const statusOptions = ["scheduled", "completed", "canceled", "no_show"];

const AddAppointment = ({ onCancel, onSuccess }: Props) => {
  const { user } = useAuth(); // 👈 trenutni ulogovani user (sestra/admin)
  const { patients, fetchPatients, loading: patientsLoading, error: patientsError } = usePatients();
  const { addAppointment, loading, error, successMsg } = useAppointment();

  const [form, setForm] = useState({
    patient_id: "", // čuvamo pacijentov id
    scheduled_at: "",
    appointment_date: "",
    status: "scheduled",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.patient_id) return;

    const scheduledAtFormatted = form.scheduled_at.replace("T", " ") + ":00";
    const appointmentDateFormatted = form.appointment_date.replace("T", " ") + ":00";

    // pronalazimo pacijenta da uzmemo medical_record.id
    const selectedPatient = patients.find((p: any) => p.id.toString() === form.patient_id);
    const medicalRecordId = selectedPatient?.medical_record?.id;

    if (!medicalRecordId) {
      alert("Pacijent nema zdravstveni karton");
      return;
    }

    await addAppointment({
      user_id: user?.id, // 👈 ulogovani user (sestra/admin)
      medical_record_id: medicalRecordId, // 👈 karton pacijenta
      scheduled_at: scheduledAtFormatted,
      appointment_date: appointmentDateFormatted,
      status: form.status as "scheduled" | "completed" | "canceled" | "no_show",
    });

    if (!error) {
      onSuccess();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" mb={3}>
          Add New Appointment
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* 👇 Pacijent */}
          <Autocomplete
            options={patients}
            getOptionLabel={(option: any) => option.user?.name ?? ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={patientsLoading}
            onChange={(_, value) =>
              setForm({ ...form, patient_id: value ? value.id.toString() : "" })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient"
                margin="normal"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {patientsLoading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TextField
            label="Scheduled At"
            name="scheduled_at"
            type="datetime-local"
            fullWidth
            required
            margin="normal"
            value={form.scheduled_at}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Appointment Date"
            name="appointment_date"
            type="datetime-local"
            fullWidth
            required
            margin="normal"
            value={form.appointment_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outlined" onClick={onCancel} fullWidth>
              Cancel
            </Button>
          </Box>

          {patientsError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {patientsError}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMsg}
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AddAppointment;
