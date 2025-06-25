import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CampaignsPage from './pages/CampaignsPage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UsersPage from './pages/UsersPage';
import TemplatesPage from './pages/TemplatesPage';
import RealTimeUpdatesPage from './pages/RealTimeUpdatesPage';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import { Toaster } from 'react-hot-toast';
import { SubscriptionProvider } from './components/SubscriptionContext';

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
  useEffect(() => {
    // Send a "warm-up" request to the backend to prevent cold starts on Render
    fetch(`${import.meta.env.VITE_API_URL}/ping`).catch(err => {
      console.log('Server is likely asleep, waking it up...', err.message);
    });
  }, []);

  
  return (
    <ThemeProvider theme={theme}>
      <SubscriptionProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/failure" element={<PaymentFailurePage />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/analytics" element={<RealTimeUpdatesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route element={<AdminRoute />}>
                  <Route path="/users" element={<UsersPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/campaigns" />} />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

export default App;
