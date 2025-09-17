import React, { useEffect } from "react";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { useRecords } from "../components/medicalRecord/hooks/useRecords";
import MedicalRecordInfo from "../components/medicalRecord/medicalRecordInfo";

type Props = {
  patientId: number;
};

const MedicalRecordPage: React.FC<Props> = ({ patientId }) => {
  const { record, loading, error, fetchRecord } = useRecords();

  // učitaj karton kada se promeni pacijent
  useEffect(() => {
    if (patientId) {
      fetchRecord(patientId);
    }
  }, [patientId]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Loader */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Greška */}
      {error && (
        <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#ffe6e6", mt: 2 }}>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Paper>
      )}

      {/* Karton */}
      {!loading && !error && record && (
        <Box sx={{ width: "100%", maxWidth: "1200px" }}>
          <MedicalRecordInfo record={record} />
        </Box>
      )}
    </Box>
  );
};

export default MedicalRecordPage;
