import { useEffect, useState } from "react";
import { api } from "../../../auth/api";
import { useDebounce } from "use-debounce";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // filters
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  // delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);
  const [newDoctorId, setNewDoctorId] = useState<number | "">("");

  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedSpecialization] = useDebounce(specialization, 500);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(
        `/doctors?page=${page}&per_page=8&search=${debouncedSearch}&specialization=${debouncedSpecialization}`
      );

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success && Array.isArray(raw.data?.data)) {
        setDoctors(raw.data.data);
        setTotalPages(raw.data.last_page || 1);
      } else {
        setError("Nepoznat format odgovora sa servera");
      }
    } catch (err: any) {
      console.error("API greška:", err);
      setError("Greška prilikom učitavanja doktora");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, debouncedSearch, debouncedSpecialization]);

  const handleDeleteClick = (doctorId: number) => {
    setDoctorToDelete(doctorId);
    setDeleteDialogOpen(true);
    setError(null);
    setSuccessMsg(null);
  };

  const handleDeleteConfirm = async () => {
    if (doctorToDelete && newDoctorId !== "") {
      try {
        await api.delete(`/doctors/${doctorToDelete}`, {
          data: { new_doctor_id: newDoctorId },
        });

        setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete));
        setSuccessMsg("Doktor je uspešno obrisan");
      } catch (err: any) {
        console.error("Greška prilikom brisanja:", err);
        setError(
          err.response?.data?.message || "Greška prilikom brisanja doktora"
        );
      }
    } else {
      setError("Morate uneti ID doktora koji preuzima kartone");
    }
    setDeleteDialogOpen(false);
    setDoctorToDelete(null);
    setNewDoctorId("");
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDoctorToDelete(null);
    setNewDoctorId("");
  };

  const updateDoctor = async (
    id: number,
    updatedData: {
      specialization?: string;
      description?: string;
      name?: string;
      email?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 👇 šaljemo kombinovane podatke (doctor + user)
      const res = await api.put(`/doctors/${id}`, updatedData);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === id ? raw.data : doc))
        );
        setSuccessMsg("Doktor je uspešno izmenjen");
        return { success: true, data: raw.data };
      } else {
        setError("Neuspešno ažuriranje doktora");
        return { success: false };
      }
    } catch (err: any) {
      console.error("Greška prilikom izmene doktora:", err);
      setError(err.response?.data?.message || "Greška prilikom izmene doktora");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    doctors,
    loading,
    error,
    successMsg,
    setSuccessMsg, // <--- Dodato
    fetchDoctors, // <--- Dodato
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    specialization,
    setSpecialization,
    deleteDialogOpen,
    doctorToDelete,
    newDoctorId,
    setNewDoctorId,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    updateDoctor,
  };
};
