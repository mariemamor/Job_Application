import * as React from 'react';
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  GoogleIcon,
  SitemarkIcon,
} from '../components/CustomIcons';
import { registerUser } from '../api/auth';

/* ------------------ TYPES ------------------ */

type UIRole = 'jobseeker' | 'recruiter';
type DBRole = 'user' | 'business';

type RegisterUser = {
  firstName: string;
  lastName: string;
  role: UIRole;
  email: string;
  password: string;
};

/* ------------------ STYLES ------------------ */

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
}));

/* ------------------ INITIAL STATE ------------------ */

const INITIAL_USER: RegisterUser = {
  firstName: '',
  lastName: '',
  role: 'jobseeker',
  email: '',
  password: '',
};

/* ------------------ COMPONENT ------------------ */

export default function SignUp() {
  const [user, setUser] = React.useState<RegisterUser>(INITIAL_USER);
  const [error, setError] = React.useState('');
type FrontendRole = 'jobseeker' | 'recruiter';
type DBRole = 'user' | 'business' | 'admin';

const mapRoleToDB = (role: FrontendRole): DBRole => {
  switch(role) {
    case 'jobseeker':
      return 'user';
    case 'recruiter':
      return 'business';
  }
};
  /* -------- handle inputs -------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  /* -------- handle role -------- */
  const handleRoleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRole: UIRole | null
  ) => {
    if (newRole) {
      setUser((prev) => ({ ...prev, role: newRole }));
    }
  };

  /* -------- map role for backend -------- */

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setError("");

    const payload = {
      ...user,
      role: mapRoleToDB(user.role as FrontendRole)  // map before sending
    };

    const response = await registerUser(payload);

    console.log(response);
  } catch (error: any) {
    setError(error.response?.data?.message || "Server error");
  }
};


  return (
    <>
      <CssBaseline />
      <SignUpContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <SitemarkIcon />

          <Typography variant="h4" textAlign="center">
            Sign up
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <TextField
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <TextField
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Choose your role</FormLabel>
              <ToggleButtonGroup
                value={user.role}
                exclusive
                onChange={handleRoleChange}
                fullWidth
              >
                <ToggleButton value="jobseeker">Job Seeker</ToggleButton>
                <ToggleButton value="recruiter">Recruiter</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField
                name="password"
                value={user.password}
                onChange={handleChange}
                type="password"
                required
                fullWidth
              />
            </FormControl>

            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" fullWidth>
              Sign up
            </Button>
          </Box>

          <Divider>or</Divider>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>

          <Typography textAlign="center">
            Already have an account?{' '}
            <Link href="/login">Sign in</Link>
          </Typography>
        </Card>
      </SignUpContainer>
    </>
  );
}
