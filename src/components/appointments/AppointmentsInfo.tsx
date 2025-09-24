import { useEffect } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useAppointment } from "./hooks/useAppointment";
import { useAuth } from "../../auth/useAuth";
import Layout from "../layout/Layout";
import AppointmentCalendar from "./AppointmentCalendar";
import AppointmentFilters from "./AppointmentFilter";
import PageWrapper from "../PageWrapper";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../notifications/NotificationProvider"; // 👈 importujemo hook

type Props = {
  onAddAppointment: () => void;
};

const AppointmentInfo = ({ onAddAppointment }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification(); // 👈 hook za notifikacije

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

  useEffect(() => {
    if (error) {
      notify(error, "error");
    }
  }, [error, notify]);

  useEffect(() => {
    if (successMsg) {
      notify(successMsg, "success");
    }
  }, [successMsg, notify]);

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

        {!loading && records.length > 0 && (
          <PageWrapper>
            <AppointmentCalendar
              records={records}
              user={user}
              updateAppointment={async (id, data) => {
                try {
                  await updateAppointment(id, data);
                  notify("Termin uspešno ažuriran", "success");
                } catch {
                  notify("Greška prilikom ažuriranja termina", "error");
                }
              }}
              deleteAppointment={async (id) => {
                try {
                  await deleteAppointment(id);
                  notify("Termin uspešno obrisan", "success");
                } catch {
                  notify("Greška prilikom brisanja termina", "error");
                }
              }}
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
