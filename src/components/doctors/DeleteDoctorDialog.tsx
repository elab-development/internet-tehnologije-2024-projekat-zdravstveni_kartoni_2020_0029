import React from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions,
  Button, TextField
} from "@mui/material";

type DeleteDoctorDialogProps = {
  open: boolean;
  doctorId: number | null;
  newDoctorId: number | "";
  setNewDoctorId: (id: number | "") => void;
  onCancel: () => void;
  onConfirm: () => void;
};


const DeleteDoctorDialog: React.FC<DeleteDoctorDialogProps> = ({
  open,
  doctorId,
  newDoctorId,
  setNewDoctorId,
  onCancel,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Delete Doctor</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Unesite ID doktora koji će preuzeti kartone od doktora kojeg brišete:
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        label="Novi doktor ID"
        type="number"
        fullWidth
        value={newDoctorId}
        onChange={(e) => setNewDoctorId(Number(e.target.value))}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">Cancel</Button>
      <Button onClick={onConfirm} color="error" autoFocus>Delete</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDoctorDialog;
