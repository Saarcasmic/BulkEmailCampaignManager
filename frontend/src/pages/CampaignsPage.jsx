import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, BarChart3, Eye, ChevronLeft, ChevronRight, File, Send } from 'lucide-react';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent, TextField, Paper, InputAdornment, Chip, Fab, Stack, Divider, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import MenuItem from '@mui/material/MenuItem';
import MetricsModal from '../components/MetricsModal';
import AnalyticsModal from '../components/AnalyticsModal';
import toast from 'react-hot-toast';
import { useSubscription } from '../components/SubscriptionContext';

const campaignSchema = {
  title: 'Campaign',
  type: 'object',
  required: ['name', 'recipients', 'subject', 'content'],
  properties: {
    name: { type: 'string', title: 'Campaign Name' },
    description: { type: 'string', title: 'Description' },
    recipients: { type: 'string', title: 'Recipients' },
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

const itemsPerPage = 5;

// Custom Widgets for RJSF Form
const CustomTextWidget = (props) => {
  const { id, placeholder, required, readonly, disabled, label, value, onChange, onBlur, onFocus, schema } = props;
  return (
    <div className="space-y-2">
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#374151' }}>
        {schema.title || label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        required={required}
        disabled={disabled || readonly}
        value={value || ''}
        onChange={(event) => onChange(event.target.value === '' ? undefined : event.target.value)}
        onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
        onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
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
  );
};

const CustomTextareaWidget = (props) => {
  const { id, placeholder, required, readonly, disabled, label, value, onChange, onBlur, onFocus, schema } = props;
  return (
    <div className="space-y-2">
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#374151' }}>
        {schema.title || label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        multiline
        rows={5}
        variant="outlined"
        placeholder={placeholder}
        required={required}
        disabled={disabled || readonly}
        value={value || ''}
        onChange={(event) => onChange(event.target.value === '' ? undefined : event.target.value)}
        onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
        onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
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
  );
};

const widgets = {
  TextWidget: CustomTextWidget,
  TextareaWidget: CustomTextareaWidget,
};

const uiSchema = {
  name: { 'ui:placeholder': '🚀 Summer Sale Campaign' },
  description: { 'ui:placeholder': '📝 A short, catchy description for your campaign.' },
  recipients: { 'ui:placeholder': 'user1@example.com, user2@example.com, ...' },
  subject: { 'ui:placeholder': '☀️ Your engaging email subject line' },
  content: { 'ui:placeholder': '<h1>Your amazing HTML content here...</h1><p>Get 50% off!</p>' },
  scheduledAt: { 'ui:widget': 'hidden' },
  scheduledTimezone: { 'ui:widget': 'hidden' },
};

const CustomTitleField = () => <></>;

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [user, setUser] = useState(null);
  const formRef = useRef(null);
  const { status: subscriptionStatus, loading: subscriptionLoading } = useSubscription();

  const fetchCampaigns = async () => {
    const res = await api.get('/campaigns');
    if (Array.isArray(res.data)) {
      setCampaigns(res.data);
    } else {
      setCampaigns([]);
      console.error("Expected campaigns to be an array:");
    }
  };

  const fetchTemplates = async () => {
    const res = await api.get('/templates');
    if (Array.isArray(res.data)) {
      setTemplates(res.data);
    } else {
      setTemplates([]);
      console.error("Expected templates to be an array:");
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
        localStorage.setItem('user', JSON.stringify(userRes.data));
        await fetchCampaigns();
        await fetchTemplates();
      } catch (error) {
        toast.error('Failed to load user data. Please log in again.');
        navigate('/login');
      }
    };
    fetchInitialData();
  }, [navigate]);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (campaign.status && campaign.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpen = async (edit) => {
    if (!user) {
      toast.error('User data is still loading, please wait a moment.');
      return;
    }
  
    if (!user.isSenderVerified) {
      toast.error('Please verify your sender email in the Profile section before creating a campaign.');
      navigate('/profile');
      return;
    }
  
    const toastId = toast.loading('Checking verification status...');
  
    try {
      const { data } = await api.get('/verification/status');
      if (data.isVerified) {
        toast.dismiss(toastId);
        setEditing(edit);
        setOpen(true);
        fetchTemplates(); // Refresh templates list
        if (edit) {
          const loadedFormData = { ...edit };
          if (Array.isArray(loadedFormData.recipients)) {
            loadedFormData.recipients = loadedFormData.recipients.join(', ');
          }
          setFormData(loadedFormData);

          if (edit.scheduledAt && edit.scheduledTimezone) {
            setScheduledAt(DateTime.fromISO(edit.scheduledAt, { zone: edit.scheduledTimezone }));
            setScheduledTimezone(edit.scheduledTimezone);
          } else {
            setScheduledAt(null);
            setScheduledTimezone('America/New_York');
          }
        } else {
          setFormData({ name: '', description: '', recipients: '', subject: '', content: '' });
          setScheduledAt(DateTime.local());
          setScheduledTimezone('America/New_York');
        }
      } else {
        // Verification status is no longer valid.
        const updatedUser = { ...user, isSenderVerified: false };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.error('Your sender verification is no longer valid. Please re-verify.', { id: toastId });
        navigate('/profile');
      }
    } catch (error) {
      console.error("Failed to check verification status", error);
      toast.error('Could not verify your sender status. Kindly verify your sender status in the profile section.', { id: toastId });
      navigate('/profile');
    }
  };

  const handleFormChange = ({ formData }) => {
    setFormData(formData);
  };

  const handleSubmit = async ({ formData }) => {
    let payload = { ...formData };

    if (typeof payload.recipients === 'string') {
      payload.recipients = payload.recipients.split(',').map(email => email.trim()).filter(Boolean);
    }
    
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

  const handleViewMetrics = (campaign) => {
    setSelectedCampaign(campaign);
    setShowMetricsModal(true);
  };

  const handleViewAnalytics = (campaign) => {
    setSelectedCampaign(campaign);
    setShowAnalyticsModal(true);
  };

  const confirmDelete = async () => {
    await handleDelete(showDeleteConfirm);
    setShowDeleteConfirm(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your email marketing campaigns</p>
        </div>
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 ${
              (subscriptionStatus !== 'trial' && subscriptionStatus !== 'active') || subscriptionLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            onClick={() => {
              if (subscriptionStatus === 'trial' || subscriptionStatus === 'active') {
                handleOpen(null);
              }
            }}
            disabled={subscriptionStatus !== 'trial' && subscriptionStatus !== 'active'}
            type="button"
          >
            <Plus className="h-5 w-5" />
            <span>New Campaign</span>
          </motion.button>
          {(subscriptionStatus !== 'trial' && subscriptionStatus !== 'active') && !subscriptionLoading && (
            <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
              Kindly start your trial to use it.
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Campaign Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCampaigns.map((campaign, index) => (
                <motion.tr
                  key={campaign._id || campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit"
                        onClick={() => handleOpen(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewMetrics(campaign)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="View Metrics"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        title="Analysis"
                        onClick={() => handleViewAnalytics(campaign)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowDeleteConfirm(campaign._id || campaign.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-900">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      
      {/* Dialogs for New/Edit Campaign and Template */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}>
        <DialogTitle sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', p: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#111827' }}>
            {editing ? '✍️ Edit Campaign' : '✨ Create New Campaign'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill out the details below to launch your next campaign.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: 'white' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<File />}
            onClick={() => setTemplateDialogOpen(true)}
            sx={{
              mt: 2,
              mb: 4,
              py: 1.5,
              borderRadius: '12px',
              bgcolor: 'rgba(99, 102, 241, 0.1)',
              color: '#4f46e5',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.2)',
                boxShadow: '0px 4px 20px rgba(99, 102, 241, 0.15)',
              },
              boxShadow: 'none',
            }}
          >
            Use a Pre-built Template
          </Button>
          <Form
            ref={formRef}
            schema={campaignSchema}
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onError={console.log}
            validator={validator}
            uiSchema={uiSchema}
            widgets={widgets}
            fields={{ TitleField: CustomTitleField }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <DateTimePicker
                  label="Scheduled At"
                  value={scheduledAt}
                  onChange={date => {
                    setScheduledAt(date);
                    setFormData(prev => ({ ...prev, scheduledAt: date ? date.toISO() : null }));
                  }}
                  timeSteps={{ minutes: 1 }}
                  renderInput={(params) => <TextField {...params} fullWidth sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                    },
                  }} />}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                {commonTimeZones.map(tz => (
                  <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                ))}
              </TextField>
            </div>
            <div style={{ display: 'none' }}>
              <Button type="submit"></Button>
            </div>
          </Form>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#4b5563' }}>Cancel</Button>
          <Button
            onClick={() => formRef.current.submit()}
            variant="contained"
            startIcon={<Send />}
            sx={{ borderRadius: '12px', fontWeight: 'bold' }}
          >
            {editing ? 'Save Changes' : 'Save Campaign'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', p: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#111827' }}>
            📚 Choose a Template
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a template to kick-start your campaign content.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: '#f9fafb', mt: 2 }}>
          <div className="space-y-3">
            {templates.length === 0 && <Typography className="text-center text-gray-500 py-8">No templates found.</Typography>}
            {templates.map(t => (
              <motion.div
                key={t._id}
                whileHover={{ scale: 1.02, boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-blue-500"
                onClick={() => handleUseTemplate(t)}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#111827' }}>{t.name}</Typography>
                <Typography variant="body2" color="text.secondary" className="truncate">Subject: {t.subject}</Typography>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    

      {/* Metrics Modal */}
      {showMetricsModal && selectedCampaign && (
        <MetricsModal
          campaignId={selectedCampaign._id}
          onClose={() => setShowMetricsModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-white rounded-2xl p-6 max-w-md w-full mx-4'
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Campaign</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this campaign? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && selectedCampaign && (
        <AnalyticsModal
          campaignId={selectedCampaign._id}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}
    </div>
  );
}