import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container,
  Link as MuiLink,
  Alert
} from '@mui/material'
import { useNavigate } from 'react-router-dom';

export default function Register() {
  // const { data, setData, post, processing, errors, reset } = useForm({
  //   name: '',
  //   surname: '',
  //   email: '',
  //   password: '',
  //   password_confirmation: '',
  // })

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   post('/register', {
  //     onSuccess: () => reset('password', 'password_confirmation'),
  //   })
  // }
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      {/* <Head title="Register" /> */}
      
      <Box
        //component={Paper}
        component="form" 
        //onSubmit={handleSubmit} 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 3
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Create Account
        </Typography>
        
        {/* Display non-field errors */}
        {/* {errors.message && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {errors.message}
          </Alert>
        )} */}

        <Box component="form" 
        //onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="First Name"
              name="name"
              autoComplete="given-name"
              autoFocus
              //value={data.name}
              //onChange={(e) => setData('name', e.target.value)}
              //error={!!errors.name}
              //helperText={errors.name}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="surname"
              label="Last Name"
              name="surname"
              autoComplete="family-name"
              // value={data.surname}
              // onChange={(e) => setData('surname', e.target.value)}
              // error={!!errors.surname}
              // helperText={errors.surname}
            />
          </Box>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            // value={data.email}
            // onChange={(e) => setData('email', e.target.value)}
            // error={!!errors.email}
            // helperText={errors.email}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            // value={data.password}
            // onChange={(e) => setData('password', e.target.value)}
            // error={!!errors.password}
            // helperText={errors.password}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password_confirmation"
            label="Confirm Password"
            type="password"
            id="password_confirmation"
            // value={data.password_confirmation}
            // onChange={(e) => setData('password_confirmation', e.target.value)}
            // error={!!errors.password_confirmation}
            // helperText={errors.password_confirmation}
          />

          <Button
            type="submit"
            onClick={() => navigate('/login')}
            fullWidth
            variant="contained"
            //disabled={processing}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {/* {processing ? 'Registering...' : 'Sign Up'} */}
            Sign Up
          </Button>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <MuiLink 
              //component={InertiaLink} 
              href="/login" 
              variant="body2"
              sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' },
                 userSelect: 'none',     // prevent text selection
                cursor: 'pointer',      // show hand cursor
              outline: 'none', 
              }}
            >
              Already have an account? Sign In
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}