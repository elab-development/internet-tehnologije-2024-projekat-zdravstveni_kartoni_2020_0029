// import React, { useEffect } from "react";
// import PatientsTable, { BackendPatient } from "./PatientsTable";
// import { usePatients } from "./hooks/usePatients";
// import {
//   Box,
//   CircularProgress,
//   Typography,
//   Paper,
//   Pagination,
//   Stack,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const PatientsContainer: React.FC = () => {
//   const {
//     patients,
//     loading: patientsLoading,
//     error: patientsError,
//     fetchPatients,
//     page,
//     setPage,
//     totalPages,
//   } = usePatients();

//   const navigate = useNavigate();

//   // Učitaj pacijente pri promjeni stranice
//   useEffect(() => {
//     fetchPatients();
//   }, [page]);

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Loader */}
//       {patientsLoading && (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {/* Error state */}
//       {patientsError && (
//         <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#ffe6e6", mt: 2 }}>
//           <Typography color="error" align="center">
//             {patientsError}
//           </Typography>
//         </Paper>
//       )}

//       {/* Lista pacijenata */}
//       {!patientsLoading && !patientsError && (
//         <>
//           <PatientsTable
//             patients={patients}
//             onEdit={(p: BackendPatient) => console.log("Edit patient:", p)}
//             onDelete={(id: number) => console.log("Delete patient:", id)}
//             onSelect={(id: number) => {
//               console.log("👀 Klik na pacijenta, ID pacijenta:", id);
//               navigate(`/patients/medical-record/${id}`);
//             }}
//           />

//           {/* Paginacija */}
//           {totalPages > 1 && (
//             <Stack
//               spacing={2}
//               sx={{ display: "flex", alignItems: "center", mt: 3 }}
//             >
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={(_, value) => setPage(value)}
//                 color="primary"
//               />
//             </Stack>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default PatientsContainer;
