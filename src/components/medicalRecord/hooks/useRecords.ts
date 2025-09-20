import { useState } from "react";
import { api } from "../../../auth/api";

export const useRecords = () => {
  const [record, setRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 📌 Učitavanje kartona
  // Ako proslediš recordId → vraća taj karton
  // Ako pacijent pozove bez recordId → backend mu vraća njegov
  const fetchRecord = async (recordId: number | null = null) => {
    setLoading(true);
    setError(null);

    try {
      const url = recordId
        ? `/medical-records/${recordId}`
        : `/medical-records`;
      const res = await api.get(url);

      const raw =
        typeof res.data === "string"
          ? JSON.parse(res.data.replace(/^\uFEFF/, ""))
          : res.data;

      if (raw.success && raw.data) {
        setRecord(raw.data);
      } else {
        setRecord(null);
        setError("NOT_FOUND");
      }
    } catch (err: any) {
      console.error("API greška:", err);
      if (err.response?.status === 404) {
        setRecord(null);
        setError("NOT_FOUND");
      } else {
        setError("Greška prilikom učitavanja kartona");
      }
    } finally {
      setLoading(false);
    }
  };

  // 📌 Update kartona (admin ili doktor)
  const updateRecord = async (id: number, data: any) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.put(`/medical-records/${id}`, data);

      const raw =
        typeof res.data === "string"
          ? JSON.parse(res.data.replace(/^\uFEFF/, ""))
          : res.data;

      if (raw.success && raw.data) {
        setRecord(raw.data);
        setSuccessMsg(raw.message || "Karton uspešno ažuriran ✅");
      } else {
        setError("Neuspešno ažuriranje kartona");
      }
    } catch (err: any) {
      console.error("Greška pri ažuriranju kartona:", err);
      setError(
        err.response?.data?.message || "Greška prilikom ažuriranja kartona"
      );
    } finally {
      setLoading(false);
    }
  };

  // 📌 Brisanje kartona (samo admin)
  const deleteRecord = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.delete(`/medical-records/${id}`);

      const raw =
        typeof res.data === "string"
          ? JSON.parse(res.data.replace(/^\uFEFF/, ""))
          : res.data;

      if (raw.success) {
        setRecord(null);
        setSuccessMsg(raw.message || "Karton uspešno obrisan ✅");
      } else {
        setError("Neuspešno brisanje kartona");
      }
    } catch (err: any) {
      console.error("Greška pri brisanju kartona:", err);
      setError(
        err.response?.data?.message || "Greška prilikom brisanja kartona"
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchMyRecordId = async (id: number): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/medical-records/${id}/my/`);

      const raw =
        typeof res.data === "string"
          ? JSON.parse(res.data.replace(/^\uFEFF/, ""))
          : res.data;

      if (raw.success && raw.data?.id) {
        return raw.data.id; // 👈 ovde čitaš id
      }
      return null;
    } catch (err) {
      console.error("Greška pri traženju pacijentovog kartona:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    record,
    loading,
    error,
    successMsg,
    fetchRecord,
    fetchMyRecordId,
    updateRecord,
    deleteRecord,
    setRecord,
  };
};
