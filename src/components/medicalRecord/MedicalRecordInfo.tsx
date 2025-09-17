import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  Stack,
  Paper,
} from "@mui/material";

type Props = {
  record: any; // tip možeš detaljnije definisati
};

const MedicalRecordInfo: React.FC<Props> = ({ record }) => {
  if (!record) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Nema podataka o kartonu
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Naslov */}
      <Typography variant="h5" gutterBottom fontWeight="bold">
        🩺 Zdravstveni karton
      </Typography>

      <Grid container spacing={3}>
        {/* Pacijent */}
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pacijent
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Typography>
                  <b>Ime i prezime:</b> {record.patient?.user?.name}
                </Typography>
                <Typography>
                  <b>Email:</b> {record.patient?.user?.email}
                </Typography>
                <Typography>
                  <b>JMBG:</b> {record.patient?.jmbg}
                </Typography>
                <Typography>
                  <b>Datum rođenja:</b> {record.patient?.date_of_birth}
                </Typography>
                <Typography>
                  <b>Pol:</b> {record.patient?.gender}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Doktor */}
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Izabrani lekar
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Typography>
                  <b>Ime i prezime:</b> {record.doctor?.user?.name}
                </Typography>
                <Typography>
                  <b>Email:</b> {record.doctor?.user?.email}
                </Typography>
                <Typography>
                  <b>Specijalizacija:</b> {record.doctor?.specialization}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Informacije o kartonu */}
        <Grid item xs={12}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalji kartona
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Typography>
                  <b>Krvna grupa:</b>{" "}
                  <Chip label={record.blood_type} color="primary" />
                </Typography>
                <Typography>
                  <b>Alergije:</b>{" "}
                  {record.allergies || (
                    <span style={{ color: "gray" }}>Nema podataka</span>
                  )}
                </Typography>
                <Typography>
                  <b>Hronične bolesti:</b>{" "}
                  {record.chronic_diseases || (
                    <span style={{ color: "gray" }}>Nema podataka</span>
                  )}
                </Typography>
                <Typography>
                  <b>Otvoren:</b> {record.opening_date}
                </Typography>
                <Typography>
                  <b>Napomene:</b>{" "}
                  {record.notes || (
                    <span style={{ color: "gray" }}>Nema unetih napomena</span>
                  )}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Pregledi */}
      </Grid>
    </Box>
  );
};

export default MedicalRecordInfo;
