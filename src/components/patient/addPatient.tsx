import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Autocomplete,
  Alert,
} from "@mui/material";
import { useDoctors } from "../doctors/hooks/useDoctors";
import { usePatients } from "./hooks/usePatients";

type Props = {
  onCancel: () => void;
  onSuccess: () => void;
};

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AddPatient = ({ onCancel, onSuccess }: Props) => {
  const { doctors, setSearch } = useDoctors();
  const { addPatient, loading, error, successMsg } = usePatients();

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

    await addPatient({
      ...form,
      doctor_id: form.doctor_id ? Number(form.doctor_id) : undefined,
      blood_type: form.doctor_id ? form.blood_type : undefined, // ako ima doctor_id onda mora blood_type
      gender: form.gender as "male" | "female" | "other",
    });

    if (!error) {
      onSuccess();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" mb={3}>
          Add New Patient
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

          {/* Doktor autocomplete (opciono) */}
          <Autocomplete
            options={doctors}
            getOptionLabel={(option: any) =>
              option.user?.name ? `${option.user.name} (${option.specialization})` : ""
            }
            onInputChange={(_, value) => setSearch(value)}
            onChange={(_, value) =>
              setForm({ ...form, doctor_id: value ? value.id : "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Select Doctor (optional)" margin="normal" fullWidth />
            )}
          />

          {/* Blood type (obavezno samo ako je izabran doktor) */}
          <TextField
            select
            fullWidth
            label="Blood Type"
            name="blood_type"
            margin="normal"
            required={!!form.doctor_id} // required ako ima doktor
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
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outlined" onClick={onCancel} fullWidth>
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
              {successMsg}
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AddPatient;
