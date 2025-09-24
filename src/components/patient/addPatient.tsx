import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Autocomplete,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDoctors } from "../doctors/hooks/useDoctors";
import { usePatients } from "./hooks/usePatients";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

type Props = {
  onSuccess: () => void;
};

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AddPatient = ({ onSuccess }: Props) => {
  const { doctors, setSearch } = useDoctors();
  const { addPatient, loading } = usePatients();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    jmbg: "",
    date_of_birth: "",
    gender: "",
    doctor_id: "",
    blood_type: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    await addPatient({
      ...form,
      doctor_id: form.doctor_id ? Number(form.doctor_id) : undefined,
      blood_type: form.doctor_id ? form.blood_type : undefined,
      gender: form.gender as "male" | "female" | "other",
    });

    onSuccess();
    navigate("/patients");
  };

  const breadcrumbs = [
    { label: "Patients", view: "patients" },
    { label: "new Patient", view: "" },
  ];

  return (
    <Layout crumbs1={breadcrumbs}>
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

            {/* Password */}
            <TextField
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              inputProps={{ minLength: 8 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              required
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              name="confirmPassword"
              margin="normal"
              value={form.confirmPassword}
              onChange={handleChange}
              inputProps={{ minLength: 8 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              onChange={(_, value) =>
                setForm({ ...form, doctor_id: value ? value.id : "" })
              }
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
              label="Blood Type"
              name="blood_type"
              margin="normal"
              required={!!form.doctor_id}
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
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/patients")}
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AddPatient;
