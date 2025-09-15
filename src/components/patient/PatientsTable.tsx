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

export type BackendPatient = {
  id: number;
  jmbg: string;
  gender: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  medical_record?: {
    id: number;
    blood_type: string;
    doctor?: {
      id: number;
      user?: {
        name: string;
      };
    };
  };
};

type Props = {
  patients: BackendPatient[];
  onEdit: (patient: BackendPatient) => void;
  onDelete: (id: number) => void;
};

const PatientsTable: React.FC<Props> = ({ patients, onEdit, onDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>JMBG</TableCell>
          <TableCell>Blood Group</TableCell>
          <TableCell>Gender</TableCell>
          <TableCell>Doctor</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {patients.map((p) => (
          <TableRow key={p.id} hover>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.user?.name || "N/A"}</TableCell>
            <TableCell>{p.jmbg}</TableCell>
            <TableCell>{p.medical_record?.blood_type || "N/A"}</TableCell>
            <TableCell>{p.gender}</TableCell>
            <TableCell>
              {p.medical_record?.doctor?.user?.name || "N/A"}
            </TableCell>
            <TableCell align="right">
              <IconButton onClick={() => onEdit(p)}>
                <EditIcon sx={{ color: "#1976d2" }} />
              </IconButton>
              <IconButton onClick={() => onDelete(p.id)}>
                <DeleteIcon sx={{ color: "#d32f2f" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default PatientsTable;






