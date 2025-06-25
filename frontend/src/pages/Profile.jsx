import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        // Step 1: Authenticate and get user data. This is a critical step.
        const userRes = await api.get('/auth/me');
        const userData = userRes.data;

        // Step 2: Check live verification status. Failure here is not critical; it just means the user is not verified.
        try {
          const statusRes = await api.get('/verification/status');
          if (statusRes.data.isVerified) {
            // Live status is verified. Update our user object to reflect this.
            const updatedUser = { ...userData, isSenderVerified: true };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Keep localStorage in sync
          } else {
            // Live status is not verified. Show the default/unverified UI.
            setUser(userData);
          }
        } catch (verificationError) {
          // A failure to get status (e.g., 404) also means the user is not verified. Show default UI.
          console.log("Could not get verification status, showing default state.", verificationError.message);
          setUser({...userData, isSenderVerified: false});
          
        }

      } catch (authError) {
        // A failure here is a critical authentication issue.
        console.error("Authentication failed:", authError);
        setError('Your session may have expired. Please log in again.');
        setUser(null);
        // Redirecting to login is a good practice on auth failure.
        // navigate('/login'); 
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleStartVerification = async () => {
    try {
      setStatusMessage('Sending verification email...');
      const res = await api.post('/verification/start');
      setStatusMessage(res.data.message);
    } catch (err) {
      setStatusMessage(err.response?.data?.message || 'Failed to start verification.');
    }
  };
  
  const handleCheckStatus = async () => {
    try {
      setStatusMessage('Checking status...');
      const res = await api.get('/verification/status');
      // After checking, we refetch the user data to update the UI,
      // as the backend updates the verification status in the DB.
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      setStatusMessage(`Status: ${res.data.status}`);
    } catch (err) {
      setStatusMessage(err.response?.data?.message || 'Failed to check status.');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account and sender settings.</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Mail className="h-10 w-10 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sender Verification</h3>
          
          {user?.isSenderVerified ? (
            <div className="flex items-center space-x-3 bg-green-50 text-green-800 p-4 rounded-xl border border-green-200">
              <CheckCircle className="h-6 w-6" />
              <p className="font-medium">Your email address is verified and can be used to send campaigns.</p>
            </div>
          ) : (
            <div className="space-y-4 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-3 text-yellow-800">
                <AlertTriangle className="h-6 w-6" />
                <p className="font-medium">Your email is not verified. You must verify it before you can send campaigns.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartVerification}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Verification Email
                </button>
                <button
                  onClick={handleCheckStatus}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Check Status</span>
                </button>
              </div>

              {statusMessage && <p className="text-sm text-gray-700 mt-3">{statusMessage}</p>}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 