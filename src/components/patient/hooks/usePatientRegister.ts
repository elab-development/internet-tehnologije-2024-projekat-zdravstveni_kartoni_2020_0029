import { useState } from "react";
import { api } from "../../../auth/api";

export const usePatientRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null); // promenjeno u niz stringova
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const registerPatient = async (data: {
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
      const res = await api.post("/patients/register", data);

      let raw = res.data;
      if (typeof raw === "string") {
        raw = raw.replace(/^\uFEFF/, "");
        raw = JSON.parse(raw);
      }

      if (raw.success) {
        setSuccessMsg(raw.message || "Pacijent uspešno registrovan ✅");
        return raw.data;
      } else {
        setError(["Neuspešan pokušaj registracije pacijenta"]);
      }
    } catch (err: any) {
      console.error("Greška prilikom registracije pacijenta:", err);

      if (err.response?.status === 422 && err.response.data?.errors) {
        // Laravel vraća errors kao objekat { polje: [poruke...] }
        const errors = err.response.data.errors;
        const messages = Object.values(errors).flat(); // pravi niz stringova
        setError(messages);
      } else if (err.response?.data?.message) {
        setError([err.response.data.message]);
      } else {
        setError(["Greška prilikom registracije pacijenta"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    registerPatient,
    loading,
    error,
    successMsg,
  };
};
