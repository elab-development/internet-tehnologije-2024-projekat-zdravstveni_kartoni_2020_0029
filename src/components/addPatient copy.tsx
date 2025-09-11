import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  MenuItem,
  Paper,
} from "@mui/material";
import { api } from "../auth/api";

type Props = {
  onCancel: () => void;
};

const AddPatient = ({ onCancel }: Props) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    jmbg: "",
    date_of_birth: "",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/patients", form);
      console.log("Patient created:", res.data);
      onCancel(); // vrati se na listu pacijenata
    } catch (err) {
      console.error("Greška prilikom dodavanja pacijenta:", err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>

        <Typography variant="h5" mb={3}>
          Add New Patient
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="JMBG"
            name="jmbg"
            margin="normal"
            value={form.jmbg}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            name="date_of_birth"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.date_of_birth}
            onChange={handleChange}
          />
          {/* Pol */}
          <TextField
            select
            fullWidth
            label="Gender"
            name="gender"
            margin="normal"
            value={form.gender}
            onChange={handleChange}
          >
            <MenuItem value="male">male</MenuItem>
            <MenuItem value="female">female</MenuItem>
          </TextField>

          {/* Dugmići */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained" fullWidth>
              Save
            </Button>
            <Button variant="outlined" onClick={onCancel} fullWidth>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddPatient;

