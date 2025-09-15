import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { api } from "../../auth/api";
import { useAuth } from "../../auth/useAuth";

const DoctorUpdate = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    description: "",
  });

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api
      .get(`/doctors/${id}`)
      .then((res) => {
        const doc = res.data.data;
        setFormData({
          name: doc.user.name,
          email: doc.user.email,
          specialization: doc.specialization,
          description: doc.description || "",
        });
      })
      .catch(() => setError("Greška prilikom učitavanja doktora"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.put(`/doctors/${id}`, formData);
      setSuccess("Uspešno izmenjeni podaci doktora ✅");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Greška prilikom izmene doktora"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user?.role || user.role !== "admin") {
    return <Alert severity="error">Samo admin može menjati doktore</Alert>;
  }

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>
        Izmena podataka doktora
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        label="Ime"
        name="name"
        fullWidth
        value={formData.name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        fullWidth
        value={formData.email}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Specijalizacija"
        name="specialization"
        fullWidth
        value={formData.specialization}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Opis"
        name="description"
        fullWidth
        multiline
        rows={4}
        value={formData.description}
        onChange={handleChange}
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={updating}
        sx={{ mt: 2 }}
      >
        Sačuvaj izmene
      </Button>
    </Box>
  );
};

export default DoctorUpdate;
