import React from 'react';
import {
  Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddButton from './AddButton';
import {useNavigate} from 'react-router-dom'

const Patients = ({ patients}) => {
  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4,  userSelect: 'none' }}>
          <Typography variant="h4">Patient patients</Typography>
          <AddButton
            text="New patient"
            link="/register"
          />
        </Box>
    <TableContainer component={Paper}
        sx={{ 
            textDecoration: 'none',
            userSelect: 'none', 
            outline: 'none', 
              }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>JMBG</TableCell>
            <TableCell>Blood Group</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} hover>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.jmbg}</TableCell>
              <TableCell>{patient.blood_group}</TableCell>
              <TableCell>{patient.gender}
              </TableCell>
              <TableCell align="right">
                <IconButton 
                //onClick={() => onEdit(patient)}
                >
                  <EditIcon sx={{ color: '#1976d2' }} />
                </IconButton>
                <IconButton 
                //onClick={() => onDelete(patient.id)}
                >
                  <DeleteIcon sx={{ color: '#d32f2f' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default Patients;

