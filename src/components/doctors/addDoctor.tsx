import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";
import { api } from "../../auth/api";

type Props = {
  onCancel: () => void;
  onSuccess: () => void; // ✅ dodato
};

const AddDoctor = ({ onCancel, onSuccess }: Props) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/doctors", form);
      console.log("Doctor created:", res.data);
      onSuccess(); // ✅ poziva prebacivanje + snackbar iz Dashboard-a
    } catch (err) {
      console.error("Greška prilikom dodavanja doktora:", err);
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
          Add New Doctor
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
            select
            fullWidth
            label="Specialization"
            name="specialization"
            margin="normal"
            value={form.specialization}
            onChange={handleChange}
          >
            {["Kardiolog", "Neurolog", "Hirurg", "Pedijatar", "Ortoped"].map(
              (spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            fullWidth
            label="Description"
            name="description"
            margin="normal"
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
          />

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

export default AddDoctor;





