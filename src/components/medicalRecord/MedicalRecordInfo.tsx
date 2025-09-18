import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";

type Props = {
  record: any;
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const MedicalRecordInfo: React.FC<Props> = ({ record }) => {
  if (!record) {
    return (
      <Card sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Nema podataka o kartonu
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        {/* Naslov */}
        <Typography
          variant="h5"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 4, textAlign: "center" }}
        >
          🩺 Zdravstveni karton
        </Typography>

        {/* Red: Pacijent i Doktor */}
        <Grid container spacing={3}>
          {/* Pacijent */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 72, height: 72 }}>
                {getInitials(record.patient?.user?.name)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Pacijent
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {record.patient?.user?.name}
                </Typography>
                <Typography color="text.secondary" fontSize={14}>
                  {record.patient?.user?.email}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography>
              <b>JMBG:</b> {record.patient?.jmbg}
            </Typography>
            <Typography>
              <b>Datum rođenja:</b> {record.patient?.date_of_birth}
            </Typography>
            <Typography>
              <b>Pol:</b> {record.patient?.gender}
            </Typography>
          </Grid>

          {/* Doktor */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: "secondary.main", width: 72, height: 72 }}>
                {getInitials(record.doctor?.user?.name)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Doktor
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {record.doctor?.user?.name}
                </Typography>
                <Typography color="text.secondary" fontSize={14}>
                  {record.doctor?.user?.email}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography>
              <b>Specijalizacija:</b> {record.doctor?.specialization}
            </Typography>
          </Grid>
        </Grid>

        {/* Detalji kartona */}
        <Box mt={4}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Detalji kartona
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Typography>
              <b>Krvna grupa:</b>{" "}
              {record.blood_type ? (
                <Chip label={record.blood_type} color="primary" size="small" />
              ) : (
                <span style={{ color: "gray" }}>Nema podataka</span>
              )}
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
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              <b>Napomene:</b>{" "}
              {record.notes || (
                <span style={{ color: "gray" }}>Nema unetih napomena</span>
              )}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordInfo;
