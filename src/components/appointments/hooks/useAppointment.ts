import { useState, useCallback, useEffect } from "react";
import { api } from "../../../auth/api";
import { useDebounce } from "use-debounce";
import { useAuth } from "../../../auth/useAuth"; // 👈 dodaj auth

export const useAppointment = () => {
  const { user } = useAuth(); // 👈 ovde imamo usera i njegovu rolu/id

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 🔎 filter state
  const [patientSearch, setPatientSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // debounce
  const [debouncedPatientSearch] = useDebounce(patientSearch, 400);
  const [debouncedStatusFilter] = useDebounce(statusFilter, 300);

  // fetch appointments sa filterima
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};

      // ako je pacijent ulogovan, automatski filtriramo po njegovom ID-u
      if (user?.role === "patient") {
        params.patient_id = user.id; // 👈 backend mora da podrži ovo
      } else {
        if (debouncedPatientSearch) params.patient = debouncedPatientSearch;
      }

      if (debouncedStatusFilter) params.status = debouncedStatusFilter;

      const res = await api.get("/appointments", { params });

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success && Array.isArray(raw.data)) {
        setAppointments(raw.data);
      } else {
        setError("Nepoznat format odgovora sa servera");
      }
    } catch (err: any) {
      setError("Greška prilikom učitavanja termina");
    } finally {
      setLoading(false);
    }
  }, [debouncedPatientSearch, debouncedStatusFilter, user]);

  // automatski refetch
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // add, update, delete ostaju isti…
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
      setError(
        err.response?.data?.message || "Greška prilikom dodavanja termina"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: number, data: { status: string }) => {
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
    statusFilter,
    setStatusFilter,
  };
};
