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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import ExaminationsTable from "../examinations/ExaminationsTable";

// 👇 importuj globalni sistem notifikacija
import { useNotification } from "../notifications/NotificationProvider";

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

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Grid container spacing={1} sx={{ mb: 1 }}>
    <Grid item xs={4}>
      <Typography variant="body2" color="text.secondary" fontWeight="bold">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body2">{value}</Typography>
    </Grid>
  </Grid>
);

const MedicalRecordInfo: React.FC<Props> = ({ record, onEdit }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useNotification();

  if (!record) {
    notify("Nema podataka o kartonu", "warning");
    return (
      <Card sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Nema podataka o kartonu
        </Typography>
      </Card>
    );
  }

  const canEdit = user?.role === "admin" || user?.role === "doctor";

  return (
    <>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Zdravstveni karton{" "}
              <Typography
                component="span"
                variant="h6"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                #{record.id}
              </Typography>
            </Typography>

            <Stack direction="row" spacing={2}>
              {canEdit && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    notify("Uređivanje kartona otvoreno", "info");
                    onEdit();
                  }}
                >
                  Izmeni
                </Button>
              )}
            </Stack>
          </Box>

          {/* Pacijent i Doktor */}
          <Grid container spacing={3}>
            {/* Pacijent */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 64, height: 64 }}
                  >
                    {getInitials(record.patient?.user?.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {record.patient?.user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {record.patient?.user?.email}
                    </Typography>
                  </Box>
                </Stack>
                <Divider textAlign="left">Pacijent</Divider>
                <Box mt={2}>
                  <InfoRow label="JMBG:" value={record.patient?.jmbg} />
                  <InfoRow
                    label="Datum rođenja:"
                    value={
                      record.patient?.date_of_birth ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {new Date(
                              record.patient.date_of_birth
                            ).toLocaleDateString("sr-RS", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </Typography>
                        </Stack>
                      ) : (
                        "Nema podataka"
                      )
                    }
                  />
                  <InfoRow
                    label="Pol:"
                    value={
                      record.patient?.gender ? (
                        <Chip label={record.patient.gender} size="small" />
                      ) : (
                        "Nema podataka"
                      )
                    }
                  />
                </Box>
              </Card>
            </Grid>

            {/* Doktor */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Avatar
                    sx={{ bgcolor: "secondary.main", width: 64, height: 64 }}
                  >
                    {getInitials(record.doctor?.user?.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {record.doctor?.user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {record.doctor?.user?.email}
                    </Typography>
                  </Box>
                </Stack>
                <Divider textAlign="left">Doktor</Divider>
                <Box mt={2}>
                  <InfoRow
                    label="Specijalizacija:"
                    value={record.doctor?.specialization || "Nema"}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Detalji kartona */}
          <Box mt={4}>
            <Divider textAlign="left">Detalji kartona</Divider>
            <Box mt={2}>
              <InfoRow
                label="Krvna grupa:"
                value={
                  record.blood_type ? (
                    <Chip
                      label={record.blood_type}
                      color="primary"
                      size="small"
                    />
                  ) : (
                    "Nema podataka"
                  )
                }
              />
              <InfoRow
                label="Alergije:"
                value={
                  record.allergies && record.allergies.length > 0
                    ? Array.isArray(record.allergies)
                      ? record.allergies.join(", ")
                      : record.allergies
                    : "Nema podataka"
                }
              />
              <InfoRow
                label="Hronične bolesti:"
                value={
                  record.chronic_diseases && record.chronic_diseases.length > 0
                    ? Array.isArray(record.chronic_diseases)
                      ? record.chronic_diseases.join(", ")
                      : record.chronic_diseases
                    : "Nema podataka"
                }
              />
              <InfoRow
                label="Napomene:"
                value={
                  record.notes || (
                    <span style={{ color: "gray" }}>Nema unetih napomena</span>
                  )
                }
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 👇 Pregledi ispod kartona */}
      <Box mt={4}>
        <ExaminationsTable
          examinations={record.examinations || []}
          loading={false}
          error={null}
          successMsg={null}
          page={1}
          setPage={() => {}}
          totalPages={1}
          onDelete={() => {
            notify("Pregled obrisan", "success");
          }}
          onUpdate={async () => {
            notify("Pregled izmenjen", "success");
            return true;
          }}
          medicalRecordId={record.id.toString()}
          userRole={user?.role}
        />
      </Box>
    </>
  );
};

export default MedicalRecordInfo;
