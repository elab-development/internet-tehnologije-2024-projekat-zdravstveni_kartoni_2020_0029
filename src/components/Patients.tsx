import { Box, Typography } from '@mui/material';
import AddButton from './AddButton';

export default function Patients() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Patients</Typography>
          <AddButton
            text="Add Patient"
          />
        </Box>
  );
}
