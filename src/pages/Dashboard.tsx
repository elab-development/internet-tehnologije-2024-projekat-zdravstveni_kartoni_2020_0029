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
import PatientTable from '../components/recordinfo'
import AddButton from '../components/AddButton'
import LeftSidebar from '../components/LeftSidebar'

export default function Dashboard() {
  // Mock data
  const user = {
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    created_at: new Date().toISOString()
  }

  const patientRecords = [
    { id: 1, patient: 'Alice Smith', date: '2023-05-15', diagnosis: 'Common cold', status: 'Completed' },
    { id: 2, patient: 'Bob Johnson', date: '2023-06-20', diagnosis: 'Sprained ankle', status: 'In Treatment' },
    { id: 3, patient: 'Carol Williams', date: '2023-07-10', diagnosis: 'Migraine', status: 'Pending' }
  ]

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* <Head title="Dashboard" /> */}
      {/* Left Sidebar */}
      <LeftSidebar
        user={user}
      />
      
      
      {/* Main Content - Patient Records */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Patient Records</Typography>
          {/* <Button 
            variant="contained" 
            startIcon={<Add />}
            //component={InertiaLink} 
            href="#"
          >
            New Record
          </Button> */}
          <AddButton
            text="New Record"
          />
        </Box>
        <PatientTable 
        records={patientRecords}
        />
      </Box>
    </Box>
  )
}