import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    if (counter === 0) {
      navigate('/campaigns');
      return;
    }
    const timer = setTimeout(() => {
      setCounter((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [counter, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">
          Your subscription is now active. You will be redirected to your campaigns in <span className="font-semibold">{counter}</span> second{counter !== 1 ? 's' : ''}.
        </p>
      </motion.div>
    </div>
  );
} 