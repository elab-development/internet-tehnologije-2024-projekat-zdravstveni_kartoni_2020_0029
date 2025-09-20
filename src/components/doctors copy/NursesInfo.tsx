// src/components/nurses/NursesInfo.tsx
import React, { useState } from "react";
import {
  Alert,
  CircularProgress,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import { useNurses } from "./hooks/useNurse";
import NurseFilters from "./NurseFilters";
import NursesTable from "./NursesTable";
import DeleteNurseDialog from "./DeleteNurseDialog";
import NurseUpdate from "./NurseUpdate";
import Layout from "../layout/Layout";

const Nurses = ({ onAddNurse }: { onAddNurse: () => void }) => {
  const { user } = useAuth();
  const {
    nurses,
    loading,
    error,
    successMsg,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    department,
    setDepartment,
    deleteDialogOpen,
    nurseToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    updateNurse,
  } = useNurses();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [nurseToEdit, setNurseToEdit] = useState<any>(null);

  const handleEditClick = (nurse: any) => {
    setNurseToEdit(nurse);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setNurseToEdit(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setNurseToEdit(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          Učitavanje medicinskih sestara...
        </Typography>
      </Box>
    );
  }

  const breadcrumbs: any[] = [{ label: "Nurses", view: "nurse" }];

  return (
    <Layout crumbs1={breadcrumbs}>
      <>
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <NurseFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          onAddNurse={onAddNurse}
          user={user}
        />

        <NursesTable
          nurses={nurses}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
        />

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}

        <DeleteNurseDialog
          open={deleteDialogOpen}
          nurseId={nurseToDelete}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />

        {nurseToEdit && (
          <NurseUpdate
            open={editDialogOpen}
            nurse={nurseToEdit}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
            updateNurse={updateNurse}
          />
        )}
      </>
    </Layout>
  );
};

export default Nurses;
