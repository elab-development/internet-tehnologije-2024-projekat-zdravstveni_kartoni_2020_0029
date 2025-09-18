import { useState, useEffect } from "react";
import { api } from "../../../auth/api";
import { useDebounce } from "use-debounce";

export const usePatients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // search states
  const [search, setSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  // debounce values
  const [debouncedSearch] = useDebounce(search, 300);
  const [debouncedDoctorSearch] = useDebounce(doctorSearch, 300);

  // delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);
  const [newPatientId, setNewPatientId] = useState<number | "">("");

  // fetch patients
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      const url =
        debouncedDoctorSearch && debouncedDoctorSearch.trim() !== ""
          ? `/patients/by-doctor?page=${page}&per_page=8&doctor_name=${debouncedDoctorSearch}`
          : `/patients?page=${page}&per_page=8&search=${debouncedSearch}`;

      const res = await api.get(url);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success && Array.isArray(raw.data?.data)) {
        setPatients(raw.data.data);
        setTotalPages(raw.data.last_page || 1);
      } else {
        setError("Nepoznat format odgovora sa servera");
      }
    } catch (err: any) {
      console.error("API greška:", err);
      setError("Greška prilikom učitavanja pacijenata");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [debouncedSearch, debouncedDoctorSearch, page]);

  // ADD patient
  const addPatient = async (data: {
    name: string;
    email: string;
    password: string;
    jmbg: string;
    date_of_birth: string;
    gender: "male" | "female" | "other";
    doctor_id?: number;
    blood_type?: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.post("/patients", data);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setPatients((prev) => [raw.data, ...prev]); // dodaj novog pacijenta na listu
        setNewPatientId(raw.data.id);
        setSuccessMsg(raw.message || "Pacijent uspešno kreiran");
      } else {
        setError("Neuspešan pokušaj kreiranja pacijenta");
      }
    } catch (err: any) {
      console.error("Greška prilikom dodavanja pacijenta:", err);
      setError(
        err.response?.data?.message || "Greška prilikom dodavanja pacijenta"
      );
    } finally {
      setLoading(false);
    }
  };

  // UPDATE patient
  const updatePatient = async (
    id: number,
    data: {
      name?: string;
      email?: string;
      jmbg?: string;
      date_of_birth?: string;
      gender?: "male" | "female" | "other";
    }
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.put(`/patients/${id}`, data);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setSuccessMsg("Pacijent je uspešno izmenjen");
        setPatients((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...raw.data } : p))
        );
      } else {
        setError("Neuspešan pokušaj izmene pacijenta");
      }
    } catch (err: any) {
      console.error("Greška prilikom izmene pacijenta:", err);
      setError(
        err.response?.data?.message || "Greška prilikom izmene pacijenta"
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE patient
  const handleDeleteClick = (id: number) => {
    setPatientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (patientToDelete) {
      try {
        await api.delete(`/patients/${patientToDelete}`);
        setPatients((prev) => prev.filter((p) => p.id !== patientToDelete));
        setSuccessMsg("Pacijent je uspešno obrisan");
      } catch (err: any) {
        console.error("Greška prilikom brisanja:", err);
        setError(
          err.response?.data?.message || "Greška prilikom brisanja pacijenta"
        );
      }
    }
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
    setNewPatientId("");
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
    setNewPatientId("");
  };

  return {
    patients,
    loading,
    error,
    successMsg,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    doctorSearch,
    setDoctorSearch,
    specialization,
    setSpecialization,
    deleteDialogOpen,
    patientToDelete,
    newPatientId,
    setNewPatientId,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    fetchPatients,
    addPatient,
    updatePatient, // 👈 sad ima i date_of_birth podršku
  };
};
