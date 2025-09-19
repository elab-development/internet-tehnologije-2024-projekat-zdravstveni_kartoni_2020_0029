import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";

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
      // ✅ Redirect sada radi samo AuthProvider (preko response.redirect_to)
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
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            textAlign: "center",
            mb: 2,
          }}
        >
          Login
        </Typography>

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
              onClick={() => navigate("/register/asPatient")} // 👈 izmenjeno
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
