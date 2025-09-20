import React, { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface Nurse {
  id: number;
  user: {
    name: string;
    email: string;
  };
  department: string;
}

type Props = {
  open: boolean;
  nurse: Nurse;
  onCancel: () => void;
  onSuccess: () => void;
  updateNurse: (id: number, updatedData: any) => Promise<{ success: boolean }>;
};

const NurseUpdate: React.FC<Props> = ({
  open,
  nurse,
  onCancel,
  onSuccess,
  updateNurse,
}) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: nurse.user.name,
    email: nurse.user.email,
    department: nurse.department,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSubmit = async () => {
    setUpdating(true);
    setError(null);

    try {
      const result = await updateNurse(nurse.id, formData);
      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("notify", {
            detail: {
              type: "success",
              message: "Uspešno izmenjeni podaci medicinske sestre ✅",
            },
          })
        );
        onSuccess();
      } else {
        window.dispatchEvent(
          new CustomEvent("notify", {
            detail: {
              type: "error",
              message: "Izmena medicinske sestre nije uspela ❌",
            },
          })
        );
      }
    } catch {
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: "Greška prilikom izmene medicinske sestre ❌",
          },
        })
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Izmena podataka medicinske sestre</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Ime"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          label="Odeljenje"
          name="department"
          fullWidth
          value={formData.department}
          onChange={handleChange}
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={updating}
        >
          Sačuvaj izmene
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={updating}>
          Otkaži
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NurseUpdate;
