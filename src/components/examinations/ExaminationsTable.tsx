import React, { useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  IconButton,
  Stack,
  Tooltip,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { Examination } from "./hooks/useExaminations";
import AddButton from "../AddButton";
import { useNavigate } from "react-router-dom";

type Props = {
  examinations: Examination[];
  loading: boolean;
  error: string | null;
  successMsg?: string | null;
  page: number;
  setPage: (val: number) => void;
  totalPages: number;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    data: {
      symptom_description?: string;
      diagnosis?: string;
      therapy?: string;
    }
  ) => Promise<boolean>;
  medicalRecordId?: string;
  userRole?: string;
};

const ExaminationsTable: React.FC<Props> = ({
  examinations,
  loading,
  error,
  successMsg,
  page,
  setPage,
  totalPages,
  onDelete,
  onUpdate,
  medicalRecordId,
  userRole,
}) => {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedExam, setEditedExam] = useState<Partial<Examination>>({});

  const handleEdit = (exam: Examination) => {
    setEditingId(exam.id);
    setEditedExam({ ...exam });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedExam({});
  };

  const handleSave = async () => {
    if (!editingId) return;
    const success = await onUpdate(editingId, {
      symptom_description: editedExam.symptom_description,
      diagnosis: editedExam.diagnosis,
      therapy: editedExam.therapy,
    });
    if (success) {
      setEditingId(null);
      setEditedExam({});
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Examinations</Typography>
        {medicalRecordId && userRole !== "patient" && (
          <AddButton
            text="Add Examination"
            onClick={() =>
              navigate(`/medical-records/${medicalRecordId}/examinations/add`)
            }
          />
        )}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      {!loading && !error && examinations.length === 0 && (
        <Typography align="center" sx={{ py: 3, color: "gray" }}>
          Nema unetih pregleda
        </Typography>
      )}

      {!loading && !error && examinations.length > 0 && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell>
                  <b>Doctor</b>
                </TableCell>
                <TableCell>
                  <b>Symptoms</b>
                </TableCell>
                <TableCell>
                  <b>Diagnosis</b>
                </TableCell>
                <TableCell>
                  <b>Therapy</b>
                </TableCell>
                {userRole !== "patient" && (
                  <TableCell align="center">
                    <b>Actions</b>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {examinations.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.id}</TableCell>
                  <TableCell>
                    {new Date(exam.examination_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{exam.doctor_name}</TableCell>

                  {/* Symptoms */}
                  <TableCell>
                    {editingId === exam.id ? (
                      <TextField
                        value={editedExam.symptom_description || ""}
                        onChange={(e) =>
                          setEditedExam({
                            ...editedExam,
                            symptom_description: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      exam.symptom_description
                    )}
                  </TableCell>

                  {/* Diagnosis */}
                  <TableCell>
                    {editingId === exam.id ? (
                      <TextField
                        value={editedExam.diagnosis || ""}
                        onChange={(e) =>
                          setEditedExam({
                            ...editedExam,
                            diagnosis: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      exam.diagnosis
                    )}
                  </TableCell>

                  {/* Therapy */}
                  <TableCell>
                    {editingId === exam.id ? (
                      <TextField
                        value={editedExam.therapy || ""}
                        onChange={(e) =>
                          setEditedExam({
                            ...editedExam,
                            therapy: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      exam.therapy
                    )}
                  </TableCell>

                  {/* Actions */}
                  {userRole !== "patient" && (
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        {editingId === exam.id ? (
                          <>
                            <Tooltip title="Save">
                              <IconButton
                                color="success"
                                size="small"
                                onClick={handleSave}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton
                                color="inherit"
                                size="small"
                                onClick={handleCancel}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleEdit(exam)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => onDelete(exam.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ExaminationsTable;
