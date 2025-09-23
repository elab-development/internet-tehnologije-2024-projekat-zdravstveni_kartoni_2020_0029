import { useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useAppointment } from "./hooks/useAppointment";
import { useAuth } from "../../auth/useAuth";
import Layout from "../layout/Layout";
// import AppointmentTable from "./AppointmentTable"; // ❌ uklonili smo tabelu
import AppointmentCalendar from "./AppointmentCalendar"; // ✅ novi kalendar
import AppointmentFilters from "./AppointmentFilter";
import PageWrapper from "../PageWrapper";
import { useNavigate } from "react-router-dom";

type Props = {
  onAddAppointment: () => void;
};

const AppointmentInfo = ({ onAddAppointment }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    appointments: records,
    loading,
    error,
    successMsg,
    fetchAppointments,
    deleteAppointment,
    updateAppointment,
    patientSearch,
    setPatientSearch,
    statusFilter,
    setStatusFilter,
  } = useAppointment();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const breadcrumbs = [{ label: "Appointments", view: "appointments" }];

  const handleSelectRecord = (recordId: number) => {
    navigate(`/patients/medical-record/${recordId}`);
  };

  return (
    <Layout crumbs1={breadcrumbs}>
      <Box sx={{ p: 1 }}>
        <AppointmentFilters
          patientSearch={patientSearch}
          setPatientSearch={setPatientSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          user={user}
        />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMsg && (
          <Snackbar
            open={!!successMsg}
            autoHideDuration={4000}
            message={successMsg}
          />
        )}

        {!loading && records.length > 0 && (
          <PageWrapper>
            <AppointmentCalendar
              records={records}
              user={user}
              updateAppointment={updateAppointment}
              deleteAppointment={deleteAppointment}
              onSelectRecord={handleSelectRecord}
            />
          </PageWrapper>
        )}

        {!loading && records.length === 0 && (
          <Typography sx={{ mt: 3, textAlign: "center" }}>
            Nema termina za prikaz
          </Typography>
        )}
      </Box>
    </Layout>
  );
};

export default AppointmentInfo;
