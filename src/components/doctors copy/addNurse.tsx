// src/components/nurses/AddNurse.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import { api } from "../../auth/api";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

const AddNurse = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post("/nurses", form);
      setSuccess("Medicinska sestra uspešno kreirana ✅");
      console.log("Nurse created:", res.data);

      // nakon uspeha vrati na listu sestara
      setTimeout(() => navigate("/nurses"), 1000);
    } catch (err: any) {
      console.error("Greška prilikom dodavanja sestre:", err);
      setError(
        err.response?.data?.message || "Greška prilikom dodavanja sestre"
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
              type="password"
              label="Password"
              name="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              inputProps={{ minLength: 6 }}
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
                onClick={() => navigate("/nurses")} // 👈 cancel vodi na nurses
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AddNurse;
