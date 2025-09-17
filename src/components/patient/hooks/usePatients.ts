import { useState, useEffect } from "react";
import { api } from "../../../auth/api";
import { useDebounce } from "use-debounce"; // ako koristiš custom debounce hook

export const usePatients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // search states
  const [search, setSearch] = useState("");               // pacijent search
  const [doctorSearch, setDoctorSearch] = useState("");   // doktor search

  const [specialization, setSpecialization] = useState("");

  // debounce values (da se ne šalje zahtev na svako kucanje)
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

  // auto-fetch kad se promeni search ili stranica
  useEffect(() => {
    fetchPatients();
  }, [debouncedSearch, debouncedDoctorSearch, page]);

  // delete handlers
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

  // update patient (stub — izmeni po tvojoj logici)
  const updatePatient = async (id: number, data: any) => {
    try {
      await api.put(`/patients/${id}`, data);
      setSuccessMsg("Pacijent je uspešno izmenjen");
      fetchPatients(); // osveži listu
    } catch (err: any) {
      console.error("Greška prilikom izmene pacijenta:", err);
      setError("Greška prilikom izmene pacijenta");
    }
  };

  return {
    patients, loading, error, successMsg,
    page, setPage, totalPages,
    search, setSearch,
    doctorSearch, setDoctorSearch,   // 👈 sad imaš oba search state-a
    specialization, setSpecialization,
    deleteDialogOpen, patientToDelete, newPatientId, setNewPatientId,
    handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
    updatePatient, fetchPatients
  };
};
