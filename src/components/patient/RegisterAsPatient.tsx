import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePatientRegister } from "./hooks/usePatientRegister";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RegisterAsPatient: React.FC = () => {
  const { registerPatient, loading, error, successMsg } = usePatientRegister();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    jmbg: "",
    date_of_birth: "",
    gender: "",
    blood_type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerPatient({
      name: form.name,
      email: form.email,
      password: form.password,
      jmbg: form.jmbg,
      date_of_birth: form.date_of_birth,
      gender: form.gender as "male" | "female" | "other",
      blood_type: form.blood_type || undefined,
    });
  };

  // ⏳ Ako je uspešno registrovan → posle 2s vodi na login
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

          {/* Dugmići */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
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

          {/* Error & Success */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
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
