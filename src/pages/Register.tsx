import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Link as MuiLink,
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const navigate = useNavigate();

  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState<Date | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 📌 Real-time validacija
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) return; // ako ne poklapaju se, prekini

    console.log("Registration successful ✅");
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
        sx={{ mt: 4 }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Create Account
        </Typography>

        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <TextField fullWidth required label="First Name" name="name" />
          <TextField fullWidth required label="Last Name" name="surname" />
        </Box>

        <TextField fullWidth required label="Email" name="email" type="email" />

        {/* Password */}
        <TextField
          fullWidth
          required
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          required
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          sx={{ mt: 2 }}
        />

        <TextField fullWidth required label="JMBG" name="jmbg" sx={{ mt: 2 }} />

        <Autocomplete
          options={bloodGroups}
          renderInput={(params) => (
            <TextField {...params} label="Blood Group" />
          )}
          sx={{ mt: 2, width: "100%" }}
        />

        <FormControl fullWidth sx={{ mt: 3 }}>
          <FormLabel>Gender *</FormLabel>
          <RadioGroup
            row
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 3, width: "100%" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              value={dob}
              onChange={(newValue) => setDob(newValue)}
              disableFuture
              openTo="year"
              views={["year", "month", "day"]}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!!passwordError || !password || !confirmPassword}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          Sign Up
        </Button>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <MuiLink href="/login" variant="body2">
            Already have an account? Sign In
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
}
