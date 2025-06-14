import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography, Box, Paper, Stack } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Header from '../components/home/Header';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/campaigns');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      <div className=" absolute top-0 left-0 w-full">
            <Header fromHome={false}/>
      </div>
      <Paper sx={{ p: 4, borderRadius: 3, bgcolor: '#23242b', minWidth: 350, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 2, textAlign: 'center' }}>Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
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
              Login
            </Button>
            <Button variant="text" fullWidth sx={{ color: '#2563eb', fontWeight: 600 }} onClick={() => navigate('/register')}>
              Create an account
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
} 