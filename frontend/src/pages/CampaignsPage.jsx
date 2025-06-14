import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent, TextField, Paper, InputAdornment, Chip, Fab, Stack, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import MenuItem from '@mui/material/MenuItem';

const campaignSchema = {
  title: 'Campaign',
  type: 'object',
  required: ['name', 'recipients', 'subject', 'content'],
  properties: {
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description' },
    recipients: { type: 'array', title: 'Recipients', items: { type: 'string', format: 'email' } },
    subject: { type: 'string', title: 'Subject' },
    content: { type: 'string', title: 'Content', format: 'textarea' },
    scheduledAt: { type: 'string', title: 'Scheduled At', format: 'date-time' },
  },
};

const timeZones = DateTime.local().zone.names;
const commonTimeZones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [scheduledAt, setScheduledAt] = useState(null);
  const [scheduledTimezone, setScheduledTimezone] = useState('America/New_York');
  const [templates, setTemplates] = useState([]);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const fetchCampaigns = async () => {
    const res = await api.get('/auth/campaigns');
    setCampaigns(res.data);
  };

  const fetchTemplates = async () => {
    const res = await api.get('/auth/templates');
    setTemplates(res.data);
  };

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, []);

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (edit) => {
    setEditing(edit);
    setOpen(true);
    fetchTemplates();
    if (edit) {
      setFormData({ ...edit });
      if (edit.scheduledAt && edit.scheduledTimezone) {
        setScheduledAt(DateTime.fromISO(edit.scheduledAt, { zone: edit.scheduledTimezone }));
        setScheduledTimezone(edit.scheduledTimezone);
      } else {
        setScheduledAt(null);
        setScheduledTimezone('America/New_York');
      }
    } else {
      setFormData({});
      setScheduledAt(DateTime.local());
      setScheduledTimezone('America/New_York');
    }
  };

  const handleFormChange = ({ formData }) => {
    setFormData(formData);
  };

  const handleSubmit = async ({ formData }) => {
    let payload = { ...formData };
    if (scheduledAt) {
      payload.scheduledAt = scheduledAt.setZone('utc').toISO();
      payload.scheduledTimezone = scheduledTimezone;
    } else {
      payload.scheduledAt = null;
      payload.scheduledTimezone = scheduledTimezone;
    }
    if (editing) {
      await api.put(`/campaigns/${editing._id}`, payload);
    } else {
      await api.post('/campaigns', payload);
    }
    setOpen(false);
    setEditing(null);
    fetchCampaigns();
  };

  const handleDelete = async (id) => {
    await api.delete(`/campaigns/${id}`);
    fetchCampaigns();
  };

  const handleUseTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      subject: template.subject,
      content: template.content,
    }));
    setTemplateDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#181A20', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1 }}>Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#2563eb', borderRadius: 2, fontWeight: 600, px: 3, py: 1.2, fontSize: 16 }}
          onClick={() => handleOpen(null)}
        >
          Add New Campaign
        </Button>
      </Box>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#23242b', borderRadius: 2, px: 2, py: 1, mb: 3, maxWidth: 400 }}>
        <SearchIcon sx={{ color: '#888', mr: 1 }} />
        <InputAdornment position="start" />
        <TextField
          placeholder="Search campaigns..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          variant="standard"
          sx={{ flex: 1, input: { color: '#fff' }, '& .MuiInput-underline:before': { borderBottomColor: '#444' }, '& .MuiInput-underline:after': { borderBottomColor: '#2563eb' } }}
          InputProps={{ disableUnderline: true }}
        />
      </Box>
      {/* Campaigns List */}
      <Stack spacing={3}>
        {filteredCampaigns.map((c) => (
          <Paper key={c._id} sx={{ bgcolor: '#23242b', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>{c.name}</Typography>
              <Typography variant="body2" sx={{ color: '#aaa' }}>{c.subject}</Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>Scheduled: {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : '-'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                color={c.status === 'sent' ? 'success' : c.status === 'scheduled' ? 'info' : 'default'}
                size="small"
                sx={{ fontWeight: 600, bgcolor: c.status === 'sent' ? '#22c55e' : c.status === 'scheduled' ? '#2563eb' : '#888', color: '#fff' }}
              />
              <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => handleOpen(c)}>Edit</Button>
              <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => handleDelete(c._id)}>Delete</Button>
              <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => navigate(`/dashboard/${c._id}`)}>Metrics</Button>
              <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => navigate(`/analytics/${c._id}`)}>Analytics</Button>
            </Box>
          </Paper>
        ))}
        {filteredCampaigns.length === 0 && (
          <Typography sx={{ color: '#888', textAlign: 'center', py: 4 }}>No campaigns found.</Typography>
        )}
      </Stack>
      {/* Dialogs for New/Edit Campaign and Template */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Campaign' : 'New Campaign'}</DialogTitle>
        <DialogContent>
          <Button onClick={() => setTemplateDialogOpen(true)} sx={{ mb: 2 }}>Use Template</Button>
          <Form
            schema={campaignSchema}
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onError={console.log}
            validator={validator}
            uiSchema={{
              scheduledAt: { 'ui:widget': 'hidden' },
              scheduledTimezone: { 'ui:widget': 'hidden' },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DateTimePicker
                label="Scheduled At"
                value={scheduledAt}
                onChange={date => {
                  setScheduledAt(date);
                  setFormData(prev => ({ ...prev, scheduledAt: date ? date.toISO() : null }));
                }}
                timeSteps={{ minutes: 1 }}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
            <TextField
              select
              label="Time Zone"
              value={scheduledTimezone}
              onChange={e => {
                setScheduledTimezone(e.target.value);
                setFormData(prev => ({ ...prev, scheduledTimezone: e.target.value }));
              }}
              fullWidth
              margin="normal"
            >
              {commonTimeZones.map(tz => (
                <MenuItem key={tz} value={tz}>{tz}</MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save</Button>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Choose a Template</DialogTitle>
        <DialogContent>
          {templates.length === 0 && <Typography>No templates found.</Typography>}
          {templates.map(t => (
            <Box key={t._id} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="subtitle1">{t.name}</Typography>
              <Typography variant="body2" color="textSecondary">{t.subject}</Typography>
              <Button size="small" onClick={() => handleUseTemplate(t)}>Use This</Button>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
}