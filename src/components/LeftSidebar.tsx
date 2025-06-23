import { 
  Box, 
  Typography,
  Avatar,
  Paper,
  Divider,
  Button,
  Link,
  IconButton,
  Stack
} from '@mui/material'
import { Edit, Delete, Add, Menu } from '@mui/icons-material'
import {useNavigate} from 'react-router-dom'

type Props = {
  onSelect: (component: string) => void;
}

const LeftSidebar = ({user, activeView, onSelect}) => {
  const navigate = useNavigate()
  return (
      <Paper 
        elevation={3} 
        sx={{
          width: 300,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          height: '100vh',
          boxSizing: 'border-box',
          overflow: 'hidden',
          userSelect: 'none' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {/* <IconButton sx={{ mr: 1 }}>
            <Menu />
          </IconButton> */}
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
            variant={activeView === 'dashboard' ? 'contained' : 'outlined'}
            component={Link}
            onClick={() => onSelect('dashboard')}
            href="#"
            sx={{ justifyContent: 'flex-start' }}
          >
            Dashboard
          </Button>
          <Button 
            fullWidth
            variant={activeView === 'patients' ? 'contained' : 'outlined'}
            component={Link} 
            onClick={() => onSelect('patients')}
            href="#"
            sx={{ justifyContent: 'flex-start' }}
          >
            Patients
          </Button>
          {/* <Button 
            fullWidth
            variant={activeView === 'RecordInfo' ? 'contained' : 'outlined'}
            component={Link} 
            onClick={() => onSelect('RecordInfo')}
            href="#"
            sx={{ justifyContent: 'flex-start' }}
          >
            Appointments
          </Button> */}
        </Stack>
        
        <Box sx={{ mt: 'auto' }}>
          <Button 
            fullWidth
            variant="outlined"
            onClick={() => navigate('/login')}
            component={Link} 
            href="#"
          >
            Log out
          </Button>
        </Box>
      </Paper>
  );
};

export default LeftSidebar;
