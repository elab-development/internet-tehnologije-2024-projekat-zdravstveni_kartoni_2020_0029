import './App.css'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff', // sets the page background to white
    },
  },
});
function App() {
  return (
     <ThemeProvider theme={theme}>
      <CssBaseline />
    </ThemeProvider>
    
  )
}

export default App
