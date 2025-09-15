import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export type BackendDoctor = {
  id: number;
  specialization: string;
  description: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

type DoctorsTableProps = {
  doctors: BackendDoctor[];
  onDelete: (id: number) => void;
  onEdit: (doctor: BackendDoctor) => void;
};

const DoctorsTable: React.FC<DoctorsTableProps> = ({ doctors, onDelete, onEdit }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Specialization</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {doctors.map((doc) => (
          <TableRow key={doc.id} hover>
            <TableCell>{doc?.id}</TableCell>
            <TableCell>{doc.user?.name || "N/A"}</TableCell>
            <TableCell>{doc.user?.email || "N/A"}</TableCell>
            <TableCell>{doc.specialization}</TableCell>
            <TableCell align="right">
              <IconButton onClick={() => onEdit(doc)}>
                <EditIcon sx={{ color: "#1976d2" }} />
              </IconButton>
              <IconButton onClick={() => onDelete(doc.id)}>
                <DeleteIcon sx={{ color: "#d32f2f" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DoctorsTable;


