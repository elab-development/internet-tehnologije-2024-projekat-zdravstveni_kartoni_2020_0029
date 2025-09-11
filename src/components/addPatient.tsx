import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { api } from "../auth/api";

const AddPatient = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jmbg, setJmbg] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    api
      .post("/patients", {
        name,
        email,
        password,
        jmbg,
        date_of_birth: dateOfBirth,
        gender,
      })
      .then((res) => {
        if (res.data.success) {
          setSuccess("Pacijent uspešno dodat!");
          setName("");
          setEmail("");
          setPassword("");
          setJmbg("");
          setDateOfBirth("");
          setGender("male");
        } else {
          setError(res.data.message || "Greška pri dodavanju pacijenta");
        }
      })
      .catch((err) => {
        console.error("Greška API:", err);
        setError("Greška pri dodavanju pacijenta");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Dodaj novog pacijenta
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

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
          label="JMBG"
          fullWidth
          value={jmbg}
          onChange={(e) => setJmbg(e.target.value)}
          margin="normal"
          inputProps={{ maxLength: 13 }}
          required
        />

        <TextField
          label="Datum rođenja"
          type="date"
          fullWidth
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          select
          label="Pol"
          fullWidth
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          margin="normal"
          required
        >
          <MenuItem value="male">Muški</MenuItem>
          <MenuItem value="female">Ženski</MenuItem>
        </TextField>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Dodaj pacijenta"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddPatient;
