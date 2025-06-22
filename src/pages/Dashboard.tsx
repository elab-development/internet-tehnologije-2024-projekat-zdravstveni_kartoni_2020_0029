import { useState } from 'react'
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
import PatientTable from '../components/RecordInfo'
import AddButton from '../components/AddButton'
import LeftSidebar from '../components/LeftSidebar'
import Patients from '../components/Patients'

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

  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <PatientTable records={patientRecords}/>;
      case 'patients':
        return <Patients />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* <Head title="Dashboard" /> */}
      {/* Left Sidebar */}
      <LeftSidebar
        user={user}
        onSelect={setActiveView}
        activeView={activeView}
      />      
      {/* Main Content - Patient Records */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Patient Records</Typography>
          <AddButton
            text="New Record"
          />
        </Box> */}
         <Box flex={1} p={3}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  )
}