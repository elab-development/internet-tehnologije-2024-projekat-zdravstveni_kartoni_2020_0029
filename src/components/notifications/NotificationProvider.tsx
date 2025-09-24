import { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

type NotificationContextType = {
  notify: (
    message: string,
    severity?: "success" | "error" | "info" | "warning"
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotification mora biti korišćen unutar NotificationProvider-a"
    );
  return ctx;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const notify = (
    msg: string,
    sev: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={severity}
          sx={{ width: "100%" }}
          onClose={() => setOpen(false)}
          icon={false}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
