import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type PatientFiltersProps = {
  search: string;
  setSearch: (val: string) => void;
  specialization: string;
  setSpecialization: (val: string) => void;
  user: { role?: string } | null;
  doctorSearch: string;
  setDoctorSearch: (val: string) => void;
};

const PatientFilters: React.FC<PatientFiltersProps> = ({
  search,
  setSearch,
  specialization,
  setSpecialization,
  user,
  doctorSearch,
  setDoctorSearch,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        userSelect: "none",
      }}
    >
      <Typography variant="h4">Patients</Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* <TextField
          size="small"
          placeholder="Search by doctor..."
          value={doctorSearch}
          onChange={(e) => setDoctorSearch(e.target.value)}
        /> */}

        {(user?.role === "admin" || user?.role === "doctor") && (
          <Button
            variant="contained"
            onClick={() => navigate("/patients/addPatient")}
          >
            New Patient
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PatientFilters;
