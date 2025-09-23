import { useState } from "react";
import axios from "axios";

export interface CoronaReport {
  date: string;
  novi_slucajevi: number;
  nove_smrti: number;
  ukupno_slucajevi: number;
  ukupno_smrti: number;
}

export interface Region {
  iso: string;
  name: string;
}

export function useCorona() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📌 Učitaj listu regiona
  const fetchRegions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/corona/regions");
      console.log("fetchRegions raw response:", res.data);

      let payload: any = res.data;

      // Ako slučajno dobijemo string, parsiramo ručno
      if (typeof payload === "string") {
        try {
          // skini BOM znak ako postoji i parsiraj JSON
          payload = JSON.parse(payload.replace(/^\uFEFF/, ""));
        } catch (e) {
          console.error("❌ Ne mogu da parsiram JSON:", e);
          payload = { data: [] };
        }
      }

      // Sad payload sigurno ima objekat
      console.log("fetchRegions parsed payload:", payload);

      setRegions(payload.data || []);
      setError(null);
    } catch (err) {
      console.error("fetchRegions → greška:", err);
      setError("Greška pri učitavanju regiona");
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Učitaj podatke za određenu državu i datum
  const fetchReport = async (
    iso: string,
    date: string
  ): Promise<CoronaReport | null> => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/corona/report/${iso}`,
        {
          params: { date },
        }
      );
      console.log("Report raw response:", res.data);

      let payload: any = res.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload.replace(/^\uFEFF/, ""));
        } catch (e) {
          console.error("❌ Ne mogu da parsiram JSON:", e);
          return null;
        }
      }

      if (payload.success) {
        return payload.data as CoronaReport;
      } else {
        console.warn("Report bez success:", payload);
        return null;
      }
    } catch (err) {
      console.error("Greška pri fetchReport:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    regions,
    loading,
    error,
    fetchRegions,
    fetchReport,
  };
}
