import { useState, useEffect, useCallback } from "react";
import { api } from "../../../auth/api";

export type Examination = {
  id: number;
  appointment_id: number | null;
  medical_record_id: number;
  doctor_id: number;
  symptom_description: string;
  examination_date: string;
  diagnosis: string;
  therapy: string;
  medical_record?: {
    id: number;
    patient: {
      id: number;
      user: {
        id: number;
        name: string;
        email: string;
      };
    };
  };
  doctors?: {
    id: number;
    specialization: string;
    description?: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
};

export const useExaminations = (medicalRecordId: number | null = null) => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExaminations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = medicalRecordId
        ? `/medical-records/${medicalRecordId}/examinations?page=${page}&per_page=10`
        : `/examinations?page=${page}&per_page=10`;

      const res = await api.get(endpoint);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success && raw.data) {
        const paginator = raw.data;
        setExaminations(paginator.data || []);
        setTotalPages(paginator.last_page || 1);
      } else {
        setError("Neuspešno učitavanje pregleda");
      }
    } catch (err: any) {
      console.error("Greška pri fetch-u pregleda:", err);
      setError(err.response?.data?.message || "Greška pri učitavanju pregleda");
    } finally {
      setLoading(false);
    }
  }, [medicalRecordId, page]);

  const addExamination = useCallback(
    async (data: {
      medical_record_id: number;
      symptom_description: string;
      diagnosis: string;
      therapy: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.post("/examinations", data);

        let raw = res.data;
        if (typeof raw === "string") {
          raw = raw.replace(/^\uFEFF/, "");
          raw = JSON.parse(raw);
        }

        if (raw.success) {
          setExaminations((prev) => [raw.data, ...prev]);
          setSuccessMsg("✅ Pregled uspešno dodat");
          setTimeout(() => setSuccessMsg(null), 2000);
          return raw.data;
        } else {
          setError("Neuspešno dodavanje pregleda");
        }
      } catch (err: any) {
        console.error("Greška prilikom dodavanja pregleda:", err);
        setError(
          err.response?.data?.message || "Greška prilikom dodavanja pregleda"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateExamination = useCallback(
    async (
      id: number,
      data: {
        symptom_description?: string;
        diagnosis?: string;
        therapy?: string;
      }
    ) => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.put(`/examinations/${id}`, data);

        let raw = res.data;
        if (typeof raw === "string") {
          raw = raw.replace(/^\uFEFF/, "");
          raw = JSON.parse(raw);
        }

        if (raw.success) {
          await fetchExaminations(); // 🔄 refetch posle update-a
          setSuccessMsg("Pregled uspešno ažuriran ✅");
          setTimeout(() => setSuccessMsg(null), 2000);
          return true;
        } else {
          setError("❌ Neuspešno ažuriranje pregleda");
          return false;
        }
      } catch (err: any) {
        console.error("Greška pri update-u pregleda:", err);
        setError(err.response?.data?.message || "Greška pri update-u pregleda");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchExaminations]
  );

  const deleteExamination = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.delete(`/examinations/${id}`);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setExaminations((prev) => prev.filter((e) => e.id !== id));
        setSuccessMsg("🗑️ Pregled uspešno obrisan");
        setTimeout(() => setSuccessMsg(null), 2000);
      } else {
        setError("Neuspešno brisanje pregleda");
      }
    } catch (err: any) {
      console.error("Greška pri brisanju pregleda:", err);
      setError(err.response?.data?.message || "Greška pri brisanju pregleda");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExaminations();
  }, [fetchExaminations]);

  return {
    examinations,
    loading,
    error,
    successMsg,
    page,
    setPage,
    totalPages,
    fetchExaminations,
    addExamination,
    updateExamination,
    deleteExamination,
  };
};
