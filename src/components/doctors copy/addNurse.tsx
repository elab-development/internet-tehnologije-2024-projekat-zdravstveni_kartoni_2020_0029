// src/components/nurses/AddNurse.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { api } from "../../auth/api";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { useNotification } from "../notifications/NotificationProvider";

const AddNurse = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { notify } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      notify("Lozinke se ne poklapaju", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/nurses", {
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
      });

      console.log("Nurse created:", res.data);
      notify("Medicinska sestra uspešno kreirana", "success");

      setTimeout(() => navigate("/nurses"), 1000);
    } catch (err: any) {
      console.error("Greška prilikom dodavanja sestre:", err);
      notify(
        err.response?.data?.message || "Greška prilikom dodavanja sestre",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Nurses", view: "nurses" },
    { label: "New Nurse", view: "" },
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
            Add New Nurse
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
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              inputProps={{ minLength: 6 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              required
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              name="confirmPassword"
              margin="normal"
              value={form.confirmPassword}
              onChange={handleChange}
              inputProps={{ minLength: 6 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              required
              fullWidth
              label="Department"
              name="department"
              margin="normal"
              value={form.department}
              onChange={handleChange}
            >
              {[
                "Opšta nega",
                "Pedijatrija",
                "Intenzivna nega",
                "Ginekologija",
                "Interna medicina",
              ].map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </TextField>

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
                onClick={() => navigate("/nurses")}
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

export default AddNurse;
