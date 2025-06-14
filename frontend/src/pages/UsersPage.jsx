import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, Paper, Stack, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import axios from '../api/axios';

const roles = ['admin', 'user'];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    const res = await axios.get('/users');
    setUsers(res.data);
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleOpen = (user) => {
    setEditing(user);
    setForm(user ? { ...user, password: '' } : { name: '', email: '', role: 'user', password: '' });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`/users/${editing._id}`, form);
    } else {
      await axios.post('/auth/register', form);
    }
    setOpen(false);
    setEditing(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/users/${id}`);
    fetchUsers();
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#181A20', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1 }}>Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#2563eb', borderRadius: 2, fontWeight: 600, px: 3, py: 1.2, fontSize: 16 }}
          onClick={() => handleOpen(null)}
        >
          Add User
        </Button>
      </Box>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#23242b', borderRadius: 2, px: 2, py: 1, mb: 3, maxWidth: 400 }}>
        <SearchIcon sx={{ color: '#888', mr: 1 }} />
        <TextField
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          variant="standard"
          sx={{ flex: 1, input: { color: '#fff' }, '& .MuiInput-underline:before': { borderBottomColor: '#444' }, '& .MuiInput-underline:after': { borderBottomColor: '#2563eb' } }}
          InputProps={{ disableUnderline: true }}
        />
      </Box>
      {/* Users List */}
      <Stack spacing={3}>
        {filteredUsers.map((user) => (
          <Paper key={user._id} sx={{ bgcolor: '#23242b', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>{user.name}</Typography>
              <Typography variant="body2" sx={{ color: '#aaa' }}>{user.email}</Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</Typography>
              <Chip label={user.role} color={user.role === 'admin' ? 'secondary' : 'default'} size="small" sx={{ mt: 1, fontWeight: 600, bgcolor: user.role === 'admin' ? '#2563eb' : '#888', color: '#fff' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => handleOpen(user)}>Edit</Button>
              <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => handleDelete(user._id)}>Delete</Button>
            </Box>
          </Paper>
        ))}
        {filteredUsers.length === 0 && (
          <Typography sx={{ color: '#888', textAlign: 'center', py: 4 }}>No users found.</Typography>
        )}
      </Stack>
      {/* Dialog for Add/Edit User */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              fullWidth
              margin="normal"
              required
              disabled={!!editing}
            />
            <TextField
              select
              label="Role"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              fullWidth
              margin="normal"
            >
              {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              fullWidth
              margin="normal"
              required={!editing}
              helperText={editing ? 'Leave blank to keep current password' : ''}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
} 