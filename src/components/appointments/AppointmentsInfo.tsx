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
import AppointmentTable from "./AppointmentTable";
import AppointmentFilters from "./AppointmentFilter";

type Props = {
  onAddAppointment: () => void;
};

const AppointmentInfo = ({ onAddAppointment }: Props) => {
  const { user } = useAuth();

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

  return (
    <Layout crumbs1={breadcrumbs}>
      <Box sx={{ p: 3 }}>
        {/* 🔎 Filteri */}
        <AppointmentFilters
          patientSearch={patientSearch}
          setPatientSearch={setPatientSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          user={user}
        />

        {/* Loader */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success msg */}
        {successMsg && (
          <Snackbar
            open={!!successMsg}
            autoHideDuration={4000}
            message={successMsg}
          />
        )}

        {/* 📋 Tabela */}
        {!loading && records.length > 0 && (
          <AppointmentTable
            records={records}
            user={user}
            updateAppointment={updateAppointment}
            deleteAppointment={deleteAppointment}
          />
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
