import React from 'react';
import {
  Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddButton from './AddButton';

const PatientTable = ({ records}) => {
  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Patient Records</Typography>
          <AddButton
            text="New Record"
          />
        </Box>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Diagnosis</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} hover>
              <TableCell>{record.patient}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.diagnosis}</TableCell>
              <TableCell>
                <Box 
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: 
                          record.status === 'Completed' ? 'success.light' :
                          record.status === 'In Treatment' ? 'warning.light' :
                          'error.light',
                        color: 'common.white'
                      }}
                    >
                      {record.status}
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton 
                //onClick={() => onEdit(record)}
                >
                  <EditIcon sx={{ color: '#1976d2' }} />
                </IconButton>
                <IconButton 
                //onClick={() => onDelete(record.id)}
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

export default PatientTable;

