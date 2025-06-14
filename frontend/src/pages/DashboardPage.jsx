import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, Grid, Avatar, InputBase, Divider, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { campaignId } = useParams();

  useEffect(() => {
    if (campaignId) {
      api.get(`/campaigns`).then(res => {
        const found = res.data.find(c => c._id === campaignId);
        setCampaign(found);
        setMetrics(found?.metrics || { sent: 0, delivered: 0, opened: 0, clicked: 0 });
      });
    } else {
      api.get('/campaigns').then(res => setCampaigns(res.data));
      api.get('/campaigns').then(res => {
        const all = res.data.map(c => c.metrics || {});
        setMetrics({
          sent: all.reduce((a, b) => a + (b.sent || 0), 0),
          delivered: all.reduce((a, b) => a + (b.delivered || 0), 0),
          opened: all.reduce((a, b) => a + (b.opened || 0), 0),
          clicked: all.reduce((a, b) => a + (b.clicked || 0), 0),
        });
      });
    }
  }, [campaignId]);

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#181A20', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
          {campaignId && campaign ? campaign.name : 'Dashboard'}
        </Typography>
        {!campaignId && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: '#2563eb', borderRadius: 2, fontWeight: 600, px: 3, py: 1.2, fontSize: 16 }}
            onClick={() => navigate('/campaigns')}
          >
            Add New Campaign
          </Button>
        )}
      </Box>
      {/* Search Bar */}
      {!campaignId && (
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#23242b', borderRadius: 2, px: 2, py: 1, mb: 3, maxWidth: 400 }}>
          <SearchIcon sx={{ color: '#888', mr: 1 }} />
          <InputBase
            placeholder="Search campaigns..."
            sx={{ color: '#fff', width: '100%' }}
            inputProps={{ 'aria-label': 'search' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Box>
      )}
      {/* Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics && [
          { label: 'Sent', value: metrics.sent, color: '#2563eb' },
          { label: 'Delivered', value: metrics.delivered, color: '#22c55e' },
          { label: 'Opened', value: metrics.opened, color: '#fbbf24' },
          { label: 'Clicked', value: metrics.clicked, color: '#ef4444' },
        ].map((m, i) => (
          <Grid item xs={6} md={3} key={m.label}>
            <Card sx={{ bgcolor: '#23242b', borderRadius: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>{m.label}</Typography>
                <Typography variant="h5" sx={{ color: m.color, fontWeight: 700 }}>{m.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Recent Campaigns Section */}
      {!campaignId && (
        <Box sx={{ bgcolor: '#23242b', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>Recent Campaigns</Typography>
          <Divider sx={{ bgcolor: '#333', mb: 2 }} />
          <Stack spacing={2}>
            {filteredCampaigns.slice(0, 5).map(c => (
              <Box key={c._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#23242b', borderRadius: 2, p: 2, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>{c.name}</Typography>
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
                  <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => navigate(`/dashboard/${c._id}`)}>Metrics</Button>
                  <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => navigate(`/analytics/${c._id}`)}>Analytics</Button>
                  <Button size="small" variant="outlined" sx={{ color: '#fff', borderColor: '#444', ml: 1 }} onClick={() => navigate(`/campaigns`)}>Edit</Button>
                </Box>
              </Box>
            ))}
            {filteredCampaigns.length === 0 && (
              <Typography sx={{ color: '#888', textAlign: 'center', py: 4 }}>No campaigns found.</Typography>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
} 