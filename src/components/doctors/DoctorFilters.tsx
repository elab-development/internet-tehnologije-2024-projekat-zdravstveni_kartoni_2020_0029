import React from "react";
import { Box, TextField, Select, MenuItem, Button, Typography } from "@mui/material";

type DoctorFiltersProps = {
  search: string;
  setSearch: (val: string) => void;
  specialization: string;
  setSpecialization: (val: string) => void;
  onAddDoctor: () => void;
  user: { role?: string } | null; // možeš proširiti ako imaš definisan User tip
};

const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  search,
  setSearch,
  specialization,
  setSpecialization,
  onAddDoctor,
  user,
}) => {
  const specializations = ["Kardiolog", "Neurolog", "Hirurg", "Pedijatar", "Ortoped"];

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
      <Typography variant="h4">Doctors</Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          size="small"
          displayEmpty
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <MenuItem value="">All specializations</MenuItem>
          {specializations.map((spec) => (
            <MenuItem key={spec} value={spec}>
              {spec}
            </MenuItem>
          ))}
        </Select>

        {(user?.role === "admin" || user?.role === "doctor") && (
          <Button variant="contained" onClick={onAddDoctor}>
            New Doctor
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DoctorFilters;

