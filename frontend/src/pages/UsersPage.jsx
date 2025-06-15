import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, Paper, Stack, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import api from '../api';

const roles = ['admin', 'user'];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    const res = await api.get('/users');
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
      await api.put(`/users/${editing._id}`, form);
    } else {
      await api.post('/auth/register', form);
    }
    setOpen(false);
    setEditing(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage users and roles</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#2563eb', borderRadius: 2, fontWeight: 600, px: 3, py: 1.2, fontSize: 16 }}
          onClick={() => handleOpen(null)}
        >
          Add User
        </Button>
      </div>
      {/* Search Bar */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
        />
      </div>
      {/* Users List */}
      <div>
        <Stack spacing={3}>
          {filteredUsers.map((user) => (
            <Paper key={user._id} sx={{ bgcolor: '#23242b', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>{user.name}</Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>{user.email}</Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</Typography>
                <Chip label={user.role} color={user.role === 'admin' ? 'secondary' : 'default'} size="small" sx={{ ml: 2, fontWeight: 600, bgcolor: user.role === 'admin' ? '#2563eb' : '#888', color: '#fff' }} />
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
      </div>
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
    </div>
  );
} 