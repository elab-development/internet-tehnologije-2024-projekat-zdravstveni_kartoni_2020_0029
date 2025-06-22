import { TextField, Button, Box, Paper, Typography, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const navigate = useNavigate();
  return ( 
    <>
      {/* <Head title="Login" /> */}
      <Box 
        component="form" 
        //onSubmit={handleSubmit} 
        sx={{ mt: 3 }} 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: 300 }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '10vh',
            textAlign: 'center'
          }}>
            <Typography 
              variant="h4"
              component="h1"
              sx={{
                caretColor: 'transparent',
                userSelect: 'none',
                fontWeight: 'bold',
                color: 'primary.main',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Login form
            </Typography>
          </Box>
          
          <TextField 
            label="Email" 
            fullWidth 
            margin="normal"
            //value={data.email}
            //onChange={e => setData('email', e.target.value)}
            //error={!!errors.email}
            //helperText={errors.email}
            autoComplete="username"
          />
          
          <TextField 
            label="Password" 
            type="password" 
            fullWidth 
            margin="normal"
            //value={data.password}
            //onChange={e => setData('password', e.target.value)}
            //error={!!errors.password}
            //helperText={errors.password}
            autoComplete="current-password"
          />
          
          {/* {errors.message && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errors.message}
            </Typography>
          )} */}
          
          <Button 
            type="submit" 
            onClick={() => navigate('/dashboard')}
            variant="contained"
            fullWidth 
            sx={{ mt: 2 }}
            //disabled={processing}
          >
           {/* {processing ? 'Logging in...' : 'Login'} */}
           Login
          </Button>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '10vh',
            textAlign: 'center'
          }}>
            <MuiLink
              //component={Link}
              href="/register"
              color="primary"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Register
            </MuiLink>
          </Box>
        </Paper>
      </Box>
    </>
  );
}