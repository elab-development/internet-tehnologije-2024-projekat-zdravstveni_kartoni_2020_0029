import React from "react";
import { Box, TextField, Select, MenuItem, Button, Typography } from "@mui/material";

type PatientFiltersProps = {
  search: string;
  setSearch: (val: string) => void;
  specialization: string;
  setSpecialization: (val: string) => void;
  onAddPatient: () => void;
  user: { role?: string } | null; 
  doctorSearch: string;
  setDoctorSearch: (val: string) => void;
};

const PatientFilters: React.FC<PatientFiltersProps> = ({
  search,
  setSearch,
  specialization,
  setSpecialization,
  onAddPatient,
  user,
  doctorSearch, 
  setDoctorSearch
}) => {

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

        <TextField
          size="small"
          placeholder="Search by doctor..."
          value={doctorSearch}
          onChange={(e) => setDoctorSearch(e.target.value)}
        />

        {(user?.role === "admin" || user?.role === "patient") && (
          <Button variant="contained" onClick={onAddPatient}>
            New Patient
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PatientFilters;

