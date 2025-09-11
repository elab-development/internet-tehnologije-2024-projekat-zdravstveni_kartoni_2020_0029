import { useState, useEffect } from "react";
import {
  Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, CircularProgress, Alert, Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddButton from './AddButton';
import { api } from "../auth/api";
import { useAuth } from "../auth/useAuth";

export interface AppointmentRecord {
  appointment_id: number;
  patient: string;
  scheduled_by: string;
  appointment_date: string;
  status: string;
}

const AppoitmentInfo = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    api.get(`/appointments/doctor/${user.id}`)
      .then((res) => {
        let raw = res.data;

        if (typeof raw === "string") {
          try {
            raw = raw.replace(/^\uFEFF/, "");
            raw = JSON.parse(raw);
          } catch (err) {
            console.error("Nevalidan JSON:", raw);
            setError("Invalid JSON response from server");
            return;
          }
        }

        console.log("Appointments parsed:", raw);

        if (raw.success && Array.isArray(raw.data)) {
          setRecords(raw.data);
        } else {
          setError("Nepoznat format odgovora sa servera");
        }
      })
      .catch((err) => {
        console.error("API greška:", err);
        setError("Greška prilikom učitavanja termina");
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  // paginacija
  const startIndex = (page - 1) * perPage;
  const currentRecords = records.slice(startIndex, startIndex + perPage);
  const pageCount = Math.ceil(records.length / perPage);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Učitavanje termina...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,  
          userSelect: 'none' 
        }}
      >
        <Typography variant="h4">Appointments</Typography>
        <AddButton text="New Appointment" link="#" />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Scheduled By</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record) => (
              <TableRow key={record.appointment_id} hover>
                <TableCell>{record.patient}</TableCell>
                <TableCell>{record.scheduled_by}</TableCell>
                <TableCell>{new Date(record.appointment_date).toLocaleString()}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        record.status === 'completed' ? 'success.main' :
                        record.status === 'scheduled' ? 'info.main' :
                        record.status === 'canceled' ? 'error.main' :
                        'warning.main',
                      color: 'common.white'
                    }}
                  >
                    {record.status}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton><EditIcon sx={{ color: '#1976d2' }} /></IconButton>
                  <IconButton><DeleteIcon sx={{ color: '#d32f2f' }} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </>
  );
};

export default AppoitmentInfo;




