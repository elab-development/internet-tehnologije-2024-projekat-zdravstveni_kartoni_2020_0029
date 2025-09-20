// src/components/nurses/hooks/useNurses.ts
import { useEffect, useState } from "react";
import { api } from "../../../auth/api";
import { useDebounce } from "use-debounce";

export const useNurses = () => {
  const [nurses, setNurses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // filters
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  // delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nurseToDelete, setNurseToDelete] = useState<number | null>(null);

  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedDepartment] = useDebounce(department, 500);

  const fetchNurses = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(
        `/nurses?page=${page}&per_page=8&search=${debouncedSearch}&department=${debouncedDepartment}`
      );

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success && Array.isArray(raw.data?.data)) {
        setNurses(raw.data.data);
        setTotalPages(raw.data.last_page || 1);
      } else {
        setError("Nepoznat format odgovora sa servera");
      }
    } catch (err: any) {
      console.error("API greška:", err);
      setError("Greška prilikom učitavanja medicinskih sestara");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, [page, debouncedSearch, debouncedDepartment]);

  const handleDeleteClick = (nurseId: number) => {
    setNurseToDelete(nurseId);
    setDeleteDialogOpen(true);
    setError(null);
    setSuccessMsg(null);
  };

  const handleDeleteConfirm = async () => {
    if (nurseToDelete) {
      try {
        await api.delete(`/nurses/${nurseToDelete}`);

        setNurses((prev) => prev.filter((n) => n.id !== nurseToDelete));
        setSuccessMsg("Medicinska sestra je uspešno obrisana");
      } catch (err: any) {
        console.error("Greška prilikom brisanja:", err);
        setError(
          err.response?.data?.message ||
            "Greška prilikom brisanja medicinske sestre"
        );
      }
    } else {
      setError("Nije izabrana sestra za brisanje");
    }
    setDeleteDialogOpen(false);
    setNurseToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNurseToDelete(null);
  };

  const updateNurse = async (
    id: number,
    updatedData: {
      department?: string;
      name?: string;
      email?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.put(`/nurses/${id}`, updatedData);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setNurses((prev) => prev.map((n) => (n.id === id ? raw.data : n)));
        setSuccessMsg("Medicinska sestra uspešno izmenjena");
        return { success: true, data: raw.data };
      } else {
        setError("Neuspešno ažuriranje sestre");
        return { success: false };
      }
    } catch (err: any) {
      console.error("Greška prilikom izmene sestre:", err);
      setError(err.response?.data?.message || "Greška prilikom izmene sestre");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    nurses,
    loading,
    error,
    successMsg,
    setSuccessMsg,
    fetchNurses,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    department,
    setDepartment,
    deleteDialogOpen,
    nurseToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    updateNurse,
  };
};
