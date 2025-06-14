import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { Typography, Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Divider, Stack } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';

const COLORS = ['#2563eb', '#22c55e', '#fbbf24', '#ef4444', '#8884d8', '#82ca9d'];

export default function AnalyticsPage() {
  const { campaignId } = useParams();
  const [devices, setDevices] = useState([]);
  const [geos, setGeos] = useState([]);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    axios.get(`/analytics/${campaignId}`).then(res => {
      setDevices(Object.entries(res.data.devices).map(([name, value]) => ({ name, value })));
      setGeos(Object.entries(res.data.geos).map(([country, value]) => ({ country, value })));
    });
    axios.get(`/campaigns`).then(res => {
      setCampaign(res.data.find(c => c._id === campaignId));
    });
    // Socket.IO real-time updates
    const socket = io('/', { transports: ['websocket'] });
    socket.emit('joinCampaign', campaignId);
    socket.on('campaignUpdate', (data) => {
      if (data.analytics) {
        setDevices(Object.entries(data.analytics.devices).map(([name, value]) => ({ name, value })));
        setGeos(Object.entries(data.analytics.geos).map(([country, value]) => ({ country, value })));
      }
    });
    return () => socket.disconnect();
  }, [campaignId]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#181A20', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1, mb: 3 }}>
        {campaign ? campaign.name : 'Analytics'}
      </Typography>
      <Stack spacing={3}>
        <Paper sx={{ bgcolor: '#23242b', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>Device Breakdown</Typography>
          <Divider sx={{ bgcolor: '#333', mb: 2 }} />
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={devices} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ bgcolor: '#23242b', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>Geo Breakdown</Typography>
          <Divider sx={{ bgcolor: '#333', mb: 2 }} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#aaa', fontWeight: 600 }}>Country</TableCell>
                <TableCell sx={{ color: '#aaa', fontWeight: 600 }}>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {geos.map(row => (
                <TableRow key={row.country}>
                  <TableCell sx={{ color: '#fff' }}>{row.country}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </Box>
  );
} 