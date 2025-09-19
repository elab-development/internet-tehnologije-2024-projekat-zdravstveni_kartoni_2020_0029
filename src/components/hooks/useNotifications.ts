// src/hooks/useNotifications.ts
import { useState } from "react";

export function useNotifications() {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error">("success");

  const notifySuccess = (msg: string) => {
    setMessage(msg);
    setType("success");
  };

  const notifyError = (msg: string) => {
    setMessage(msg);
    setType("error");
  };

  const clear = () => setMessage(null);

  return { message, type, notifySuccess, notifyError, clear };
}
