import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type AppointmentCalendarProps = {
  records: {
    appointment_id: number;
    patient: string;
    appointment_date: string;
    status: string;
    medical_record_id: number;
    doctor?: {
      id: number;
      name: string;
      specialization: string;
    } | null;
    nurse?: {
      id: number;
      user_id: number;
      name: string;
      email: string;
    } | null;
  }[];
  user: { role?: string } | null;
  updateAppointment: (
    id: number,
    data: { status?: string; doctor_id?: number }
  ) => void;
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

  // 📌 za context meni
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    eventId: number | null;
  } | null>(null);

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
        ? "#81c784"
        : row.status === "canceled"
        ? "#e57373"
        : row.status === "no_show"
        ? "#b0bec5"
        : "#90caf9",
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
        eventDidMount={(info) => {
          // desni klik (context menu)
          info.el.oncontextmenu = (e) => {
            e.preventDefault();
            if (canEditStatus) {
              setContextMenu(
                contextMenu === null
                  ? {
                      mouseX: e.clientX - 2,
                      mouseY: e.clientY - 4,
                      eventId: Number(info.event.id),
                    }
                  : null
              );
            }
          };
        }}
        selectable={true}
        nowIndicator={true}
        height="80vh"
      />

      {/* Context meni za promenu statusa */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            if (contextMenu?.eventId) {
              updateAppointment(contextMenu.eventId, { status: "completed" });
            }
            setContextMenu(null);
          }}
        >
          Completed
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (contextMenu?.eventId) {
              updateAppointment(contextMenu.eventId, { status: "canceled" });
            }
            setContextMenu(null);
          }}
        >
          Canceled
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (contextMenu?.eventId) {
              updateAppointment(contextMenu.eventId, { status: "no_show" });
            }
            setContextMenu(null);
          }}
        >
          No Show
        </MenuItem>
      </Menu>

      {/* Dialog za potvrdu brisanja */}
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
