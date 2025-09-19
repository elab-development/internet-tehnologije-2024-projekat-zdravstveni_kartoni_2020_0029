import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { useRecords } from "./hooks/useRecords";
import MedicalRecordInfo from "./MedicalRecordInfo";
import MedicalRecordUpdate from "./MedicalRecordUpdate";
import { useParams } from "react-router-dom";
import Layout from "../layout/Layout";

type Props = {};

const MedicalRecordPage: React.FC<{}> = () => {
  const { patientId } = useParams();
  //const propms= useParams();  propms.patientId
  const { record, loading, error, fetchRecord } = useRecords();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchRecord(+patientId);
    }
  }, [patientId]);
  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);

  const onEditSuccess = () => {
    fetchRecord(+(patientId || ""));
    handleEditClose();
  };

  const onAddSuccess = () => {
    if (patientId) fetchRecord(+patientId);
    handleAddClose();
  };

  //p: { xs: 2, md: 4 },
  /**sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }} */

  const breadcrumbs = [
    { label: "Patients", view: "patients" },
    { label: "Medical Record", view: "" },
  ];

  return (
    <Layout crumbs1={breadcrumbs}>
      <Box>
        {/* Loader */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Nema kartona */}
        {!loading && error === "NOT_FOUND" && (
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#fff3cd", mt: 2 }}>
            <Typography align="center" gutterBottom>
              Karton nije kreiran za ovog pacijenta.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAddOpen}>
              Kreiraj karton
            </Button>
          </Paper>
        )}

        {/* Prava greška */}
        {!loading && error && error !== "NOT_FOUND" && (
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#f8d7da", mt: 2 }}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Paper>
        )}

        {/* Prikaz kartona */}
        {!loading && !error && record && (
          <MedicalRecordInfo record={record} onEdit={handleEditOpen} />
        )}

        {/* Modal za editovanje */}
        <MedicalRecordUpdate
          open={editOpen}
          onClose={handleEditClose}
          record={record}
          onSuccess={onEditSuccess}
        />

        {/* Modal za dodavanje*/}
        <MedicalRecordUpdate
          open={addOpen}
          onClose={handleAddClose}
          record={null}
          patientId={+(patientId || "")}
          onSuccess={onAddSuccess}
        />
      </Box>
    </Layout>
  );
};

export default MedicalRecordPage;
