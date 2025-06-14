import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography, Box, Paper, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/auth/register', data);
      if (localStorage.getItem('token')) {
        navigate('/users');
      } else {
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#181A20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, bgcolor: '#23242b', minWidth: 350, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 2, textAlign: 'center' }}>Register</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              variant="filled"
              sx={{ input: { color: '#fff' }, label: { color: '#aaa' }, bgcolor: '#23242b', '& .MuiFilledInput-root': { bgcolor: '#23242b', color: '#fff' } }}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="filled"
              sx={{ input: { color: '#fff' }, label: { color: '#aaa' }, bgcolor: '#23242b', '& .MuiFilledInput-root': { bgcolor: '#23242b', color: '#fff' } }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="filled"
              sx={{ input: { color: '#fff' }, label: { color: '#aaa' }, bgcolor: '#23242b', '& .MuiFilledInput-root': { bgcolor: '#23242b', color: '#fff' } }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting} sx={{ mt: 2, fontWeight: 600, borderRadius: 2, bgcolor: '#2563eb' }}>
              Register
            </Button>
            <Button variant="text" fullWidth sx={{ color: '#2563eb', fontWeight: 600 }} onClick={() => navigate('/login')}>
              Already have an account? Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
} 