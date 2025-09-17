import React from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions,
  Button, TextField
} from "@mui/material";

type DeletePatientDialogProps = {
  open: boolean;
  patientId: number | null;
  newPatientId: number | "";
  setNewPatientId: (id: number | "") => void;
  onCancel: () => void;
  onConfirm: () => void;
};


const DeletePatientDialog: React.FC<DeletePatientDialogProps> = ({
  open,
  patientId,
  newPatientId,
  setNewPatientId,
  onCancel,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Delete Patient</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Da li ste sigurni da zelite da obrisete pacijenta?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">Cancel</Button>
      <Button onClick={onConfirm} color="error" autoFocus>Delete</Button>
    </DialogActions>
  </Dialog>
);

export default DeletePatientDialog;
