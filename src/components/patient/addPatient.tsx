import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Autocomplete,
} from "@mui/material";
import { api } from "../../auth/api";
import { useDoctors } from "../doctors/hooks/useDoctors"; // 👈 koristi tvoj hook

type Props = {
  onCancel: () => void;
  onSuccess: () => void;
};

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AddPatient = ({ onCancel, onSuccess }: Props) => {
  const { doctors, setSearch } = useDoctors();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    jmbg: "",
    date_of_birth: "",
    gender: "",
    doctor_id: "",
    blood_type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/patients", form);
      console.log("Patient created:", res.data);
      onSuccess();
    } catch (err) {
      console.error("Greška prilikom dodavanja pacijenta:", err);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h6" mb={3}>
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

          {/* 👇 doktor autocomplete */}
          <Autocomplete
            options={doctors}
            getOptionLabel={(option: any) =>
              option.user?.name ? `${option.user.name} (${option.specialization})` : ""
            }
            onInputChange={(_, value) => setSearch(value)} // search radi kroz hook
            onChange={(_, value) =>
              setForm({ ...form, doctor_id: value ? value.id : "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Select Doctor" margin="normal" fullWidth />
            )}
          />

          {/* 👇 blood type combo */}
          <TextField
            select
            fullWidth
            label="Blood Type"
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
