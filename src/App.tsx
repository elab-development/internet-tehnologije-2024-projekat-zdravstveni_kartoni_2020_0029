import "./App.css";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./pages/Login";       // prilagodi putanju
import Dashboard from "./pages/Dashboard";   // prilagodi putanju

// definiši temu
const theme = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
  },
});

// komponenta App
function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Login stranica */}
        <Route path="/login" element={<LoginForm />} />

        {/* Admin dashboard */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* default route → prebaci na login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;



