import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

type AppointmentCalendarProps = {
  records: any[];
  user: { role?: string } | null;
  updateAppointment: (id: number, data: { status?: string }) => void;
  deleteAppointment: (id: number) => void;
  onSelectRecord: (recordId: number) => void;
};

const AppointmentCalendar = ({
  records,
  user,
  updateAppointment,
  deleteAppointment,
  onSelectRecord,
}: AppointmentCalendarProps) => {
  const canDelete = user?.role === "admin" || user?.role === "nurse";
  const canEditStatus =
    user?.role === "admin" || user?.role === "nurse" || user?.role === "doctor";

  // 📌 modal za brisanje
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpenDialog = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedId(null);
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      deleteAppointment(selectedId);
    }
    handleCloseDialog();
  };

  // 📌 mapiraj appointments u FullCalendar events
  const events = records.map((row) => ({
    id: row.appointment_id.toString(),
    title: `${row.patient} (${row.status})`,
    start: row.appointment_date,
    extendedProps: {
      doctor: row.doctor?.name,
      specialization: row.doctor?.specialization,
      nurse: row.nurse?.name,
      status: row.status,
      medical_record_id: row.medical_record_id,
    },
    color:
      row.status === "completed"
        ? "#81c784" // svetlo zelena
        : row.status === "canceled"
        ? "#e57373" // svetlo crvena
        : row.status === "no_show"
        ? "#b0bec5" // svetlo siva
        : "#90caf9", // svetlo plava (default)
  }));

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={(info) => {
          const eventId = Number(info.event.id);
          const recordId = info.event.extendedProps.medical_record_id;

          if (recordId) {
            onSelectRecord(recordId);
          }

          if (canDelete) {
            handleOpenDialog(eventId);
          }
        }}
        selectable={true}
        nowIndicator={true}
        height="80vh"
      />
      <style>
        {`
          .fc .fc-button {
            background-color: #90caf9;
            border: none;
            color: #0d47a1;
          }
          .fc .fc-button:hover {
            background-color: #64b5f6;
          }
        `}
      </style>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Potvrda brisanja</DialogTitle>
        <DialogContent>
          Da li ste sigurni da želite da obrišete ovaj termin?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Otkaži
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Obriši
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentCalendar;
