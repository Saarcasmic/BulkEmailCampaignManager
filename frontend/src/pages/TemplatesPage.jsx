import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography, DialogActions } from '@mui/material';
import api from '../api';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', content: '' });
  const [search, setSearch] = useState('');

  const fetchTemplates = async () => {
    const res = await api.get('/templates');
    if (Array.isArray(res.data)) {
      setTemplates(res.data);
    } else {
      setTemplates([]);
      console.error("Expected templates to be an array:");
    }
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
      await api.put(`/templates/${editing._id}`, form);
    } else {
      await api.post('/templates', form);
    }
    setOpen(false);
    setEditing(null);
    fetchTemplates();
  };

  const handleDelete = async (id) => {
    await api.delete(`/templates/${id}`);
    fetchTemplates();
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-1">Manage your email templates</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          onClick={() => handleOpen(null)}
        >
          <Plus className="h-5 w-5" />
          <span>Add Template</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTemplates.map((template, index) => (
                <motion.tr
                  key={template._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{template.name}</td>
                  <td className="px-6 py-4 text-gray-700">{template.subject}</td>
                  <td className="px-6 py-4 text-gray-600">{template.createdAt ? new Date(template.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit"
                        onClick={() => handleOpen(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete"
                        onClick={() => handleDelete(template._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredTemplates.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-8">No templates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog for Add/Edit Template */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', p: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#111827' }}>
            {editing ? '✍️ Edit Template' : '✨ Create New Template'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build a reusable email template to save time.
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3, bgcolor: 'white' }}>
            <div className="space-y-6">
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#374151', mb: 1 }}>
                  Template Name
                </Typography>
                <TextField
                  placeholder="📈 Monthly Newsletter"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#374151', mb: 1 }}>
                  Email Subject
                </Typography>
                <TextField
                  placeholder="📰 Your Latest Updates & News"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#374151', mb: 1 }}>
                  HTML Content
                </Typography>
                <TextField
                  placeholder="<h1>Welcome!</h1><p>This is your email content.</p>"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  fullWidth
                  required
                  multiline
                  minRows={8}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={() => setOpen(false)} sx={{ color: '#4b5563', textTransform: 'none' }}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: '12px', fontWeight: 'bold', textTransform: 'none' }}
            >
              {editing ? 'Save Changes' : 'Save Template'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
} 