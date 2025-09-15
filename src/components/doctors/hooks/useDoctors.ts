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


  useEffect(() => {
    setLoading(true);
    api
        .get(`/doctors?page=${page}&per_page=8&search=${debouncedSearch}&specialization=${debouncedSpecialization}`)
        .then((res) => {
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
        })
        .catch((err) => {
        console.error("API greška:", err);
        setError("Greška prilikom učitavanja doktora");
        })
        .finally(() => setLoading(false));
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
        setError(err.response?.data?.message || "Greška prilikom brisanja doktora");
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

  return {
    doctors, loading, error, successMsg,
    page, setPage, totalPages,
    search, setSearch,
    specialization, setSpecialization,
    deleteDialogOpen, doctorToDelete, newDoctorId, setNewDoctorId,
    handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
  };
};
