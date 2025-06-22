import { 
  Box, 
  Typography,
  Avatar,
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack
} from '@mui/material'
import { Edit, Delete, Add, Menu } from '@mui/icons-material'

const LeftSidebar = ({user}) => {
  return (
      <Paper 
        elevation={3} 
        sx={{
          width: 300,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          minHeight: '100vh'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton sx={{ mr: 1 }}>
            <Menu />
          </IconButton>
          <Typography variant="h6">Medical Portal</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120,
              bgcolor: 'primary.main',
              fontSize: '3rem',
              mb: 2
            }}
          >
            {user.name.charAt(0)}{user.surname.charAt(0)}
          </Avatar>
          
          <Typography variant="h6" component="h2">
            Dr. {user.name} {user.surname}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Button 
            fullWidth
            variant="contained"
            //component={InertiaLink} 
            href="#"
            sx={{ justifyContent: 'flex-start' }}
          >
            Dashboard
          </Button>
          <Button 
            fullWidth
            variant="outlined"
            //component={InertiaLink} 
            href="#"
            sx={{ justifyContent: 'flex-start' }}
          >
            Patients
          </Button>
          <Button 
            fullWidth
            variant="outlined"
            //component={InertiaLink} 
            href="#"
            sx={{ justifyContent: 'flex-start' }}
          >
            Appointments
          </Button>
        </Stack>
        
        <Box sx={{ mt: 'auto' }}>
          <Button 
            fullWidth
            variant="outlined"
            //component={InertiaLink} 
            href="#"
          >
            Settings
          </Button>
        </Box>
      </Paper>
  );
};

export default LeftSidebar;
