// src/components/nurses/DeleteNurseDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type DeleteNurseDialogProps = {
  open: boolean;
  nurseId: number | null;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteNurseDialog: React.FC<DeleteNurseDialogProps> = ({
  open,
  nurseId,
  onCancel,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Delete Nurse</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Da li ste sigurni da želite da obrišete medicinsku sestru sa ID{" "}
        <strong>{nurseId}</strong>? Ova akcija je nepovratna.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteNurseDialog;
