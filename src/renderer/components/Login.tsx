import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { auth, validateCookie } from '../../api/checkCookie';

interface LoginProps {
  init: () => void;
}

function Login({ init }: LoginProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [campus, setCampus] = useState(1);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    const getOpenModal = async () => {
      const cookie = await validateCookie();
      setOpen(cookie);
    };

    getOpenModal();
  }, []);

  const handleCampus = (value: any) => {
    setCampus(value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    const response = await auth(password);
    localStorage.setItem('siteName', campus ? 'Hobart' : 'Glenorchy');
    localStorage.setItem('SiteID', campus.toString());
    if (response === true) {
      setAlert(true);
    } else {
      setAlert(false);
      setOpen(false);
      init();
    }

    setPassword('');
  };

  return (
    <Modal open={open}>
      <Box
        sx={{
          width: '50%',
          height: 400,
          textAlign: 'center',
          margin: 'auto',
          backgroundColor: 'white',
          padding: 5,
          marginTop: 6,
        }}
      >
        <Typography variant="h4">Login (Api Key)</Typography>
        <FormControl fullWidth sx={{ marginTop: 4, width: '50%' }}>
          <InputLabel>Select Campus</InputLabel>
          <Select
            required
            label="Select Campus"
            value={campus}
            onChange={(e) => handleCampus(e.target.value)}
          >
            <MenuItem value={1}>Hobart</MenuItem>
            <MenuItem value={2}>Glenorchy</MenuItem>
          </Select>
          <TextField
            required
            label="API Key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'password' : 'text'}
            sx={{ marginTop: 4 }}
            InputProps={{
              endAdornment: (
                <Button onClick={handleShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </Button>
              ),
            }}
          />
          {alert && (
            <Alert sx={{ margin: 2 }} severity="warning">
              Incorrect API Key
            </Alert>
          )}

          <Button
            variant="contained"
            sx={{ width: '50%', margin: 'auto', marginTop: 2 }}
            type="submit"
            onClick={handleSubmit}
          >
            Login
          </Button>
        </FormControl>
      </Box>
    </Modal>
  );
}

export default Login;
