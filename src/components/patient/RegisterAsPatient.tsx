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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePatientRegister } from "./hooks/usePatientRegister";
import { useDoctors } from "../doctors/hooks/useDoctors";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RegisterAsPatient: React.FC = () => {
  const { registerPatient, loading, error, successMsg } = usePatientRegister();
  const { doctors, setSearch } = useDoctors();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    jmbg: "",
    date_of_birth: "",
    gender: "",
    blood_type: "",
    doctor_id: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ✅ Validacija u realnom vremenu
  useEffect(() => {
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError(null);
    }
  }, [form.password, form.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) return; // stop ako ne poklapa confirm password

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      jmbg: form.jmbg,
      date_of_birth: form.date_of_birth,
      gender: form.gender as "male" | "female" | "other",
      doctor_id: form.doctor_id ? Number(form.doctor_id) : undefined,
      blood_type: form.blood_type || undefined,
    };

    console.log("📤 Registracija pacijenta payload:", payload);
    await registerPatient(payload);
  };

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" mb={3}>
          Register as Patient
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Name"
            name="name"
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            type="password"
            label="Password"
            name="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
            inputProps={{ minLength: 8 }}
          />

          {/* ✅ Confirm Password */}
          <TextField
            fullWidth
            required
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            margin="normal"
            value={form.confirmPassword}
            onChange={handleChange}
            error={!!passwordError}
            helperText={passwordError}
          />

          <TextField
            fullWidth
            required
            label="JMBG"
            name="jmbg"
            margin="normal"
            value={form.jmbg}
            onChange={handleChange}
            inputProps={{ maxLength: 13, minLength: 13 }}
          />

          <TextField
            fullWidth
            required
            type="date"
            label="Date of Birth"
            name="date_of_birth"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.date_of_birth}
            onChange={handleChange}
          />

          <TextField
            select
            required
            fullWidth
            label="Gender"
            name="gender"
            margin="normal"
            value={form.gender}
            onChange={handleChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <Autocomplete
            options={doctors}
            getOptionLabel={(option: any) =>
              option.user?.name
                ? `${option.user.name} (${option.specialization})`
                : ""
            }
            onInputChange={(_, value) => setSearch(value)}
            onChange={(_, value) => {
              const id = value ? value.id : "";
              setForm({ ...form, doctor_id: id });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Doctor (optional)"
                margin="normal"
                fullWidth
              />
            )}
          />

          <TextField
            select
            fullWidth
            label="Blood Type (optional)"
            name="blood_type"
            margin="normal"
            value={form.blood_type}
            onChange={handleChange}
          >
            <MenuItem value="">(none)</MenuItem>
            {bloodTypes.map((bt) => (
              <MenuItem key={bt} value={bt}>
                {bt}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !!passwordError}
            >
              {loading ? "Saving..." : "Register"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              fullWidth
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <ul>
                {error.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMsg} — prebacujem na login...
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterAsPatient;
