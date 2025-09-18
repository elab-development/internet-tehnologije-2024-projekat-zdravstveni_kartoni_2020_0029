import React, { useEffect } from "react";
import { Box, CircularProgress, Typography, Paper, Button } from "@mui/material";
import { useRecords } from "./hooks/useRecords";
import MedicalRecordInfo from "./MedicalRecordInfo";

type Props = {
  patientId: number;
};

const MedicalRecordPage: React.FC<Props> = ({ patientId }) => {
  const { record, loading, error, fetchRecord } = useRecords();

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

      {/* Nema kartona */}
      {!loading && error === "NOT_FOUND" && (
        <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#fff3cd", mt: 2 }}>
          <Typography align="center" gutterBottom>
            Karton nije kreiran za ovog pacijenta.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => console.log("Otvori formu za kreiranje kartona")}
          >
            Kreiraj karton
          </Button>
        </Paper>
      )}

      {/* Prava greška */}
      {!loading && error && error !== "NOT_FOUND" && (
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
