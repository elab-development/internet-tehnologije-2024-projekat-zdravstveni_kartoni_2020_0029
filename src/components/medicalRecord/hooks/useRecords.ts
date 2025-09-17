import { useState } from "react";
import { api } from "../../../auth/api";

export const useRecords = () => {
  const [record, setRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // učitavanje kartona za pacijenta
  const fetchRecord = async (patientId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/medical-records/${patientId}`);
      let raw = res.data;

      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setRecord(raw.data);
      } else {
        setError(raw.message || "Greška prilikom učitavanja kartona");
      }
    } catch (err: any) {
      console.error("API greška:", err);
      setError("Greška prilikom komunikacije sa serverom");
    } finally {
      setLoading(false);
    }
  };

  return {
    record,
    loading,
    error,
    fetchRecord,
    setRecord, // ako želiš ručno da menjaš state
  };
};
