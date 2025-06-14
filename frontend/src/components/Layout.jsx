import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button, Avatar, InputBase, Typography, Divider } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Email';
import TemplateIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import UsersIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const navItems = [
  { text: 'Campaigns', icon: <CampaignIcon />, path: '/campaigns' },
  { text: 'Templates', icon: <TemplateIcon />, path: '/templates' },
  { text: 'Real Time Updates', icon: <AnalyticsIcon />, path: '/analytics' },
  // Users tab will be conditionally rendered below
];

function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  } catch {
    return null;
  }
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#181A20' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#181A20',
            color: '#fff',
            border: 'none',
            borderRadius: '24px',
            m: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
            p: 0,
          },
        }}
        PaperProps={{ elevation: 4 }}
      >
        {/* User card at top */}
        <Box sx={{ width: '100%', px: 3, pt: 4, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#23242b', borderRadius: 2, p: 2, mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, mr: 1 }} src={user?.avatar || ''}>
              {user?.name?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: '#aaa' }}>Welcome,</Typography>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>{user?.name || 'User'}</Typography>
            </Box>
          </Box>
        </Box>
        {/* Navigation */}
        <List sx={{ width: '100%', flex: 1 }}>
          {navItems.map((item) => {
            // Custom logic for active tab
            let isActive = false;
            if (item.path === '/campaigns') {
              isActive = location.pathname.startsWith('/campaigns') ||
                /^\/analytics\/[\w-]+$/.test(location.pathname) ||
                /^\/dashboard\/[\w-]+$/.test(location.pathname);
            } else if (item.path === '/analytics') {
              isActive = location.pathname === '/analytics';
            } else {
              isActive = location.pathname.startsWith(item.path);
            }
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 2,
                  mb: 1,
                  py: 1.2,
                  background: isActive
                    ? 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)'
                    : 'transparent',
                  color: isActive ? '#fff' : '#bdbdbd',
                  fontWeight: 600,
                  fontSize: 17,
                  transition: 'background 0.2s, color 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    background: 'rgba(37,99,235,0.18)',
                    color: '#fff',
                    cursor: 'pointer',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40, fontSize: 26 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 700, fontSize: 17 }} />
              </ListItem>
            );
          })}
          {user && user.role === 'admin' && (
            <ListItem button key="Users" onClick={() => navigate('/users')} sx={{ borderRadius: 2, mx: 2, mb: 1, py: 1.2, cursor: 'pointer', transition: 'background 0.2s, color 0.2s', '&:hover': { background: 'rgba(37,99,235,0.18)', color: '#fff', cursor: 'pointer' } }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40, fontSize: 26 }}><UsersIcon /></ListItemIcon>
              <ListItemText primary="Users" primaryTypographyProps={{ fontWeight: 700, fontSize: 17 }} />
            </ListItem>
          )}
        </List>
        {/* Logout at bottom */}
        <Box sx={{ width: '100%', px: 3, pb: 3, pt: 2 }}>
          <Button variant="contained" color="secondary" size="large" onClick={handleLogout} fullWidth sx={{ borderRadius: 2, fontWeight: 600, mt: 2, bgcolor: '#2563eb' }}>
            Logout
          </Button>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flex: 1, width: 'auto', bgcolor: '#181A20' }}>
        <Outlet />
      </Box>
    </Box>
  );
} 