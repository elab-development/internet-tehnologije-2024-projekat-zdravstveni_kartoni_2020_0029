import {
  TextField,
  Button,
  Box,
  Paper,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";

import doctorLogo from "../assets/doctor_logo.png";

export default function LoginForm() {
  const [email, setEmail] = useState("admin@klinika.rs");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginWithCredentials, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginWithCredentials(email, password);
      navigate("/appointments"); // ✅ redirect na appointments
    } catch (err: any) {
      setError(err.message || "Došlo je do greške pri prijavi");
    }
  };

  return (
    <Box
      height="100vh"
      component="form"
      onSubmit={handleLogin}
      sx={{ backgroundColor: "#f5f5f5" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 450, // 👈 širi pravougaonik
          borderRadius: 3,
        }}
      >
        {/* LOGO */}
        <Box display="flex" justifyContent="center" mb={2}>
          <img
            src={doctorLogo}
            alt="Doctor Logo"
            style={{ width: "300px", height: "300px" }}
          />
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : "PRIJAVI SE"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <MuiLink
              onClick={() => navigate("/register/asPatient")}
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
                userSelect: "none",
              }}
            >
              Register as patient
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
