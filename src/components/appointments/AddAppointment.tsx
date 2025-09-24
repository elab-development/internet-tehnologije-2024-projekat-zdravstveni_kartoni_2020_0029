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
import { useAppointment } from "./hooks/useAppointment";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { api } from "../../auth/api";
import Layout from "../layout/Layout";

type Props = {
  onSuccess: () => void;
};

const statusOptions = ["scheduled", "completed", "canceled", "no_show"];

const getTodayDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const AddAppointment = ({ onSuccess }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { addAppointment, loading, error, successMsg } = useAppointment();

  const [patients, setPatients] = useState<any[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState<string | null>(null);

  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState<string | null>(null);

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    scheduled_at: getTodayDateTime(),
    appointment_date: "",
    status: "scheduled",
  });

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "nurse") {
      navigate("/appointments");
    }
  }, [user, navigate]);

  const fetchAllPatients = async (search = "") => {
    setPatientsLoading(true);
    setPatientsError(null);
    try {
      const res = await api.get(`/patients?per_page=20&search=${search}`);
      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }
      if (raw.success && Array.isArray(raw.data?.data)) {
        setPatients(raw.data.data);
      } else {
        setPatientsError("Nepoznat format odgovora sa servera");
      }
    } catch (err) {
      console.error("Greška prilikom učitavanja pacijenata:", err);
      setPatientsError("Greška prilikom učitavanja pacijenata");
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchAllDoctors = async (search = "") => {
    setDoctorsLoading(true);
    setDoctorsError(null);
    try {
      const res = await api.get(`/doctors?per_page=20&search=${search}`);
      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }
      if (raw.success && Array.isArray(raw.data?.data)) {
        setDoctors(raw.data.data);
      } else {
        setDoctorsError("Nepoznat format odgovora sa servera");
      }
    } catch (err) {
      console.error("Greška prilikom učitavanja doktora:", err);
      setDoctorsError("Greška prilikom učitavanja doktora");
    } finally {
      setDoctorsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPatients();
    fetchAllDoctors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.patient_id || !form.doctor_id) {
      alert("❌ Morate odabrati i pacijenta i doktora");
      return;
    }

    const scheduledAtFormatted = form.scheduled_at.replace("T", " ") + ":00";
    const appointmentDateFormatted =
      form.appointment_date.replace("T", " ") + ":00";

    const selectedPatient = patients.find(
      (p: any) => p.id.toString() === form.patient_id
    );
    const medicalRecordId = selectedPatient?.medical_record?.id;

    if (!medicalRecordId) {
      alert("Pacijent nema zdravstveni karton");
      return;
    }

    // ✨ Backend sam postavlja nurse_id (admin → user_id, nurse → nurse_id)
    const payload: any = {
      medical_record_id: medicalRecordId,
      doctor_id: form.doctor_id,
      scheduled_at: scheduledAtFormatted,
      appointment_date: appointmentDateFormatted,
      status: form.status as "scheduled" | "completed" | "canceled" | "no_show",
    };

    await addAppointment(payload);

    if (!error) {
      onSuccess();
    }
  };

  const breadcrumbs = [
    { label: "Appointments", view: "appointments" },
    { label: "New Appointment", view: "" },
  ];

  return (
    <Layout crumbs1={breadcrumbs}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
          <Typography variant="h5" mb={3}>
            Add New Appointment
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Autocomplete
              options={patients}
              getOptionLabel={(option: any) =>
                option.user?.name ? option.user.name : ""
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={patientsLoading}
              onInputChange={(_, value) => fetchAllPatients(value)}
              onChange={(_, value) =>
                setForm({
                  ...form,
                  patient_id: value ? value.id.toString() : "",
                })
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
                        {patientsLoading ? (
                          <CircularProgress size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <Autocomplete
              options={doctors}
              getOptionLabel={(option: any) =>
                option.user?.name
                  ? `${option.user.name} (${option.specialization})`
                  : ""
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={doctorsLoading}
              onInputChange={(_, value) => fetchAllDoctors(value)}
              onChange={(_, value) =>
                setForm({
                  ...form,
                  doctor_id: value ? value.id.toString() : "",
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Doctor"
                  margin="normal"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {doctorsLoading ? <CircularProgress size={20} /> : null}
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
              margin="normal"
              value={form.scheduled_at}
              disabled
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
              label="Status"
              name="status"
              value="scheduled"
              fullWidth
              margin="normal"
              disabled
              InputProps={{
                readOnly: true,
              }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/appointments")}
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>

            {patientsError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {patientsError}
              </Alert>
            )}
            {doctorsError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {doctorsError}
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
    </Layout>
  );
};

export default AddAppointment;
