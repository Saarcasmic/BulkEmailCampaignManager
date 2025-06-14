import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CampaignsPage from './pages/CampaignsPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UsersPage from './pages/UsersPage';
import TemplatesPage from './pages/TemplatesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RealTimeUpdatesPage from './pages/RealTimeUpdatesPage';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'Inter',
      'Montserrat',
      'Segoe UI',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: 1.5,
    },
    h6: {
      fontWeight: 600,
    },
  },
  palette: {
    background: {
      default: 'linear-gradient(120deg, #f8fafc 60%, #e3e9f7 100%)',
      paper: '#f8fafc',
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#6c63ff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/:campaignId" element={<DashboardPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/analytics/:campaignId" element={<AnalyticsPage />} />
              <Route path="/analytics" element={<RealTimeUpdatesPage />} />
              <Route element={<AdminRoute />}>
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/campaigns" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
