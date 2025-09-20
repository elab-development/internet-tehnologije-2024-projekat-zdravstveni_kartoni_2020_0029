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

export type BackendNurse = {
  id: number;
  department: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

type NursesTableProps = {
  nurses: BackendNurse[];
  onDelete: (id: number) => void;
  onEdit: (nurse: BackendNurse) => void;
};

const NursesTable: React.FC<NursesTableProps> = ({
  nurses,
  onDelete,
  onEdit,
}) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Department</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {nurses.map((nurse) => (
          <TableRow key={nurse.id} hover>
            <TableCell>{nurse?.id}</TableCell>
            <TableCell>{nurse.user?.name || "N/A"}</TableCell>
            <TableCell>{nurse.user?.email || "N/A"}</TableCell>
            <TableCell>{nurse.department}</TableCell>
            <TableCell align="right">
              <IconButton onClick={() => onEdit(nurse)}>
                <EditIcon sx={{ color: "#1976d2" }} />
              </IconButton>
              <IconButton onClick={() => onDelete(nurse.id)}>
                <DeleteIcon sx={{ color: "#d32f2f" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default NursesTable;
