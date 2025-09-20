import { useState, useCallback, useEffect } from "react";
import { api } from "../../../auth/api";
import { useDebounce } from "use-debounce";

// Tipizovan appointment
export interface AppointmentRecord {
  appointment_id: number;
  patient: string;
  appointment_date: string;
  status: string;
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
}

export const useAppointment = () => {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 🔎 filter state
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // debounce za search
  const [debouncedPatientSearch] = useDebounce(patientSearch, 400);
  const [debouncedDoctorSearch] = useDebounce(doctorSearch, 400);
  const [debouncedStatusFilter] = useDebounce(statusFilter, 300);

  // fetch appointments
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (debouncedPatientSearch) params.patient = debouncedPatientSearch;
      if (debouncedDoctorSearch) params.doctor = debouncedDoctorSearch;
      if (debouncedStatusFilter) params.status = debouncedStatusFilter;

      const res = await api.get("/appointments", { params });

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success && Array.isArray(raw.data)) {
        const mapped: AppointmentRecord[] = raw.data.map((a: any) => ({
          appointment_id: a.appointment_id,
          patient: a.patient,
          appointment_date: a.appointment_date,
          status: a.status,
          doctor: a.doctor
            ? {
                id: a.doctor.id,
                name: a.doctor.name,
                specialization: a.doctor.specialization,
              }
            : null,
          nurse: a.nurse
            ? {
                id: a.nurse.id,
                user_id: a.nurse.user_id,
                name: a.nurse.name,
                email: a.nurse.email,
              }
            : null,
        }));
        setAppointments(mapped);
      } else {
        setError("Nepoznat format odgovora sa servera");
      }
    } catch (err: any) {
      console.error("Greška API:", err);
      setError("Greška prilikom učitavanja termina");
    } finally {
      setLoading(false);
    }
  }, [debouncedPatientSearch, debouncedDoctorSearch, debouncedStatusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const addAppointment = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.post("/appointments", data);
      let raw = res.data;

      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setSuccessMsg(raw.message || "Termin uspešno kreiran");
        await fetchAppointments();
      } else {
        setError("Neuspešan pokušaj kreiranja termina");
      }
    } catch (err: any) {
      console.error("Greška pri dodavanju:", err);
      setError(
        err.response?.data?.message || "Greška prilikom dodavanja termina"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (
    id: number,
    data: { status?: string; doctor_id?: number }
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.put(`/appointments/${id}`, data);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setSuccessMsg(raw.message || "Termin uspešno ažuriran");
        await fetchAppointments();
      } else {
        setError("Neuspešan pokušaj ažuriranja termina");
      }
    } catch (err: any) {
      console.error("Greška pri izmeni:", err);
      setError(
        err.response?.data?.message || "Greška prilikom ažuriranja termina"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.delete(`/appointments/${id}`);
      let raw = res.data;

      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setSuccessMsg(raw.message || "Termin uspešno obrisan");
        setAppointments((prev) => prev.filter((a) => a.appointment_id !== id));
      } else {
        setError("Neuspešan pokušaj brisanja termina");
      }
    } catch (err: any) {
      console.error("Greška pri brisanju:", err);
      setError(
        err.response?.data?.message || "Greška prilikom brisanja termina"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments,
    loading,
    error,
    successMsg,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,

    // filteri
    patientSearch,
    setPatientSearch,
    doctorSearch,
    setDoctorSearch,
    statusFilter,
    setStatusFilter,
  };
};
