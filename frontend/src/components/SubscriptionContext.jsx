import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const SubscriptionContext = createContext({
  status: 'none',
  loading: true,
  refresh: () => {},
});

export function SubscriptionProvider({ children }) {
  const [status, setStatus] = useState('none');
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/me');
      setStatus(data?.subscription?.status || 'none');
    } catch {
      setStatus('none');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ status, loading, refresh: fetchStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
} 