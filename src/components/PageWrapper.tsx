import { Box, Paper } from "@mui/material";
import { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <Box sx={{ p: 0 }}>
      <Paper sx={{ p: 0, borderRadius: 0, boxShadow: 0 }}>{children}</Paper>
    </Box>
  );
};

export default PageWrapper;
