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
import Patients from '../components/PatientsInfo'

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

  const patients = [
    { id: 1, name: 'Alice Smith', age: 25, jmbg: '1234567890123', blood_group: 'A+', gender: 'Female' },
    { id: 2, name: 'Bob Johnson', age: 30, jmbg: '9876543210987', blood_group: 'B-', gender: 'Male' },
    { id: 3, name: 'Carol Williams', age: 28, jmbg: '5678901234567', blood_group: 'AB+', gender: 'Female' },
    { id: 4, name: 'David Brown', age: 35, jmbg: '3456789012345', blood_group: 'O-', gender: 'Male' }
  ]

  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <PatientTable records={patientRecords}/>;
      case 'patients':
        return <Patients patients={patients}/>;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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