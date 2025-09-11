import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { api } from "../auth/api";
import { MenuItem } from "@mui/material";

const DoctorForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    api
      .post("/doctors", {
        name,
        email,
        password,
        specialization,
        description,
      })
      .then((res) => {
        if (res.data.success) {
          setSuccess("Doktor uspešno dodat!");
          setName("");
          setEmail("");
          setPassword("");
          setSpecialization("");
          setDescription("");
        } else {
          setError(res.data.message || "Greška pri dodavanju doktora");
        }
      })
      .catch((err) => {
        console.error("Greška API:", err);
        setError("Greška pri dodavanju doktora");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Dodaj novog doktora
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Ime i prezime"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          label="Lozinka"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />

        <TextField
        select
        label="Specijalizacija"
        fullWidth
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
        margin="normal"
        required
        >
        {["Kardiolog", "Neurolog", "Hirurg", "Pedijatar", "Ortoped"].map((spec) => (
            <MenuItem key={spec} value={spec}>
            {spec}
            </MenuItem>
        ))}
        </TextField>

        <TextField
          label="Opis"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : "Dodaj doktora"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default DoctorForm;
