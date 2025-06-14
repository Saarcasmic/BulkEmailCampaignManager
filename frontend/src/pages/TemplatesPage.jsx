import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, Paper, Stack, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../api/axios';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', content: '' });
  const [search, setSearch] = useState('');

  const fetchTemplates = async () => {
    const res = await axios.get('/templates');
    setTemplates(res.data);
  };
  useEffect(() => { fetchTemplates(); }, []);

  const handleOpen = (template) => {
    setEditing(template);
    setForm(template ? { ...template } : { name: '', subject: '', content: '' });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`/templates/${editing._id}`, form);
    } else {
      await axios.post('/templates', form);
    }
    setOpen(false);
    setEditing(null);
    fetchTemplates();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/templates/${id}`);
    fetchTemplates();
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#181A20', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1 }}>Templates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#2563eb', borderRadius: 2, fontWeight: 600, px: 3, py: 1.2, fontSize: 16 }}
          onClick={() => handleOpen(null)}
        >
          Add Template
        </Button>
      </Box>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#23242b', borderRadius: 2, px: 2, py: 1, mb: 3, maxWidth: 400 }}>
        <SearchIcon sx={{ color: '#888', mr: 1 }} />
        <TextField
          placeholder="Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          variant="standard"
          sx={{ flex: 1, input: { color: '#fff' }, '& .MuiInput-underline:before': { borderBottomColor: '#444' }, '& .MuiInput-underline:after': { borderBottomColor: '#2563eb' } }}
          InputProps={{ disableUnderline: true }}
        />
      </Box>
      {/* Templates List */}
      <Stack spacing={3}>
        {filteredTemplates.map((template) => (
          <Paper key={template._id} sx={{ bgcolor: '#23242b', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>{template.name}</Typography>
              <Typography variant="body2" sx={{ color: '#aaa' }}>{template.subject}</Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>Created: {template.createdAt ? new Date(template.createdAt).toLocaleString() : '-'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => handleOpen(template)}>Edit</Button>
              <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => handleDelete(template._id)}>Delete</Button>
            </Box>
          </Paper>
        ))}
        {filteredTemplates.length === 0 && (
          <Typography sx={{ color: '#888', textAlign: 'center', py: 4 }}>No templates found.</Typography>
        )}
      </Stack>
      {/* Dialog for Add/Edit Template */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Template' : 'Add Template'}</DialogTitle>
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
              label="Subject"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Content"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              fullWidth
              margin="normal"
              required
              multiline
              minRows={4}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
} 