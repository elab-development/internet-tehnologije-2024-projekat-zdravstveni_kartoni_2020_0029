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
  Button,
  Chip,
} from "@mui/material";

type Props = {
  record: any;
  onEdit: () => void;
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const MedicalRecordInfo: React.FC<Props> = ({record, onEdit}) => {//{ record, onEdit }
  if (!record) {
    return (
      <Card sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Nema podataka o kartonu
        </Typography>
      </Card>
    );
  }
  const handleClick = () => {
    console.log("click")
    onEdit();
  }
  
  return (
    <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            🩺 Zdravstveni karton
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => handleClick()}>
            Edit medical record
          </Button>
        </Box>

        <Grid container columnSpacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid > {/**item xs={12} sm={4} */}
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

          <Grid> {/**item xs={12} sm={4} */}
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

        <Box mt={4}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Detalji kartona
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Box>
              <Typography component="span" fontWeight="bold">
                Krvna grupa:
              </Typography>{" "}
              {record.blood_type ? (
                <Chip
                  label={record.blood_type}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              ) : (
                <span style={{ color: "gray" }}>Nema podataka</span>
              )}
            </Box>

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
