import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, BarChart3, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent, TextField, Paper, InputAdornment, Chip, Fab, Stack, Divider } from '@mui/material';
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

const itemsPerPage = 5;

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
    fetchCampaigns();
    fetchTemplates();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (campaign.status && campaign.status.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          onClick={() => handleOpen(null)}
        >
          <Plus className="h-5 w-5" />
          <span>New Campaign</span>
        </motion.button>
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