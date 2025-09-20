// src/components/nurses/NurseFilters.tsx
import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type NurseFiltersProps = {
  search: string;
  setSearch: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  user: { role?: string } | null;
};

const NurseFilters: React.FC<NurseFiltersProps> = ({
  search,
  setSearch,
  department,
  setDepartment,
  user,
}) => {
  const navigate = useNavigate();

  const departments = [
    "Opšta nega",
    "Pedijatrija",
    "Intenzivna nega",
    "Ginekologija",
    "Interna medicina",
  ];

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
      <Typography variant="h4">Nurses</Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Pretraga po imenu */}
        <TextField
          size="small"
          placeholder="Search nurses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter po odeljenju */}
        <Select
          size="small"
          displayEmpty
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <MenuItem value="">All departments</MenuItem>
          {departments.map((dep) => (
            <MenuItem key={dep} value={dep}>
              {dep}
            </MenuItem>
          ))}
        </Select>

        {/* Novi nurse samo admin dodaje */}
        {user?.role === "admin" && (
          <Button variant="contained" onClick={() => navigate("/nurses/add")}>
            New Nurse
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NurseFilters;
