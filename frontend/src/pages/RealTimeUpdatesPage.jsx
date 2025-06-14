import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, LinearProgress, Chip, Stack, Divider, Grid } from '@mui/material';
import axios from '../api/axios';
import { io } from 'socket.io-client';

const METRICS = [
  { label: 'Sent', key: 'sent', color: '#2563eb' },
  { label: 'Delivered', key: 'delivered', color: '#22c55e' },
  { label: 'Opened', key: 'opened', color: '#fbbf24' },
  { label: 'Clicked', key: 'clicked', color: '#ef4444' },
];

// Helper to get backend URL for socket.io
const getSocketUrl = () => {
  // Use env variable if set (for Vercel/Render/ngrok), else fallback to window location
  return import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:5000`;
};

export default function RealTimeUpdatesPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [progress, setProgress] = useState({}); // { [campaignId]: { sent, delivered, opened, clicked, total, status } }
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = getSocketUrl();
    let socket = io(socketUrl, { transports: ['websocket'] });
    socketRef.current = socket;
    axios.get('/campaigns').then(res => {
      setCampaigns(res.data);
      // Initialize progress state
      const initial = {};
      res.data.forEach(c => {
        initial[c._id] = {
          sent: c.metrics?.sent || 0,
          delivered: c.metrics?.delivered || 0,
          opened: c.metrics?.opened || 0,
          clicked: c.metrics?.clicked || 0,
          total: c.recipients?.length || 0,
          status: c.status,
        };
        // Join campaign room for real-time updates
        socket.emit('joinCampaign', c._id);
      });
      setProgress(initial);
    });
    // Socket.IO for real-time updates
    socket.on('campaignUpdate', data => {
      if (data._id) {
        setProgress(prev => ({
          ...prev,
          [data._id]: {
            sent: data.metrics?.sent || 0,
            delivered: data.metrics?.delivered || 0,
            opened: data.metrics?.opened || 0,
            clicked: data.metrics?.clicked || 0,
            total: data.recipients?.length || 0,
            status: data.status,
          },
        }));
      }
    });
    return () => socket.disconnect();
  }, []);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#181A20', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1, mb: 3 }}>
        Real Time Campaign Progress
      </Typography>
      <Grid container spacing={3}>
        {campaigns.map(c => {
          const prog = progress[c._id] || { sent: 0, delivered: 0, opened: 0, clicked: 0, total: c.recipients?.length || 0, status: c.status };
          const percent = prog.total > 0 ? Math.round((prog.sent / prog.total) * 100) : 0;
          return (
            <Grid item xs={12} md={6} lg={4} key={c._id}>
              <Paper sx={{ bgcolor: '#23242b', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>{c.name}</Typography>
                  <Chip
                    label={prog.status.charAt(0).toUpperCase() + prog.status.slice(1)}
                    color={prog.status === 'sent' ? 'success' : prog.status === 'scheduled' ? 'info' : 'default'}
                    size="small"
                    sx={{ fontWeight: 600, bgcolor: prog.status === 'sent' ? '#22c55e' : prog.status === 'scheduled' ? '#2563eb' : '#888', color: '#fff' }}
                  />
                </Box>
                <Divider sx={{ bgcolor: '#333', mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{ height: 10, borderRadius: 5, bgcolor: '#181A20', '& .MuiLinearProgress-bar': { bgcolor: '#2563eb' } }}
                  />
                  <Typography sx={{ color: '#fff', mt: 1, fontSize: 14 }}>{prog.sent} / {prog.total} sent</Typography>
                </Box>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                  {METRICS.map(m => (
                    <Box key={m.key} sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#aaa', mb: 0.5 }}>{m.label}</Typography>
                      <Typography variant="h6" sx={{ color: m.color, fontWeight: 700 }}>{prog[m.key] || 0}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
        {campaigns.length === 0 && (
          <Grid item xs={12}>
            <Typography sx={{ color: '#888', textAlign: 'center', py: 4 }}>No campaigns found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 