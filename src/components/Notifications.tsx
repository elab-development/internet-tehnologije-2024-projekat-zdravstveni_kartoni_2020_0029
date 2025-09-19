// src/components/Notification.tsx
import { Snackbar, Alert } from "@mui/material";

type Props = {
  message: string | null;
  type: "success" | "error";
  onClose: () => void;
};

export default function Notification({ message, type, onClose }: Props) {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={type} onClose={onClose} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
