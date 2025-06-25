import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertTriangle, RefreshCw, Crown, Star } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSubscription } from '../components/SubscriptionContext';

const planFeatures = [
    'Campaign Management',
    'Bulk & Scheduled Sending',
    'Real-Time Metrics',
    'Advanced Analytics',
    'Template Management',
];

function loadRazorpay() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState('');
    const { refresh: refreshSubscription } = useSubscription();

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            if (refreshSubscription) refreshSubscription();
        } catch (error) {
            toast.error('Session expired. Please log in again.');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                const userRes = await api.get('/auth/me');
                const userData = userRes.data;
                try {
                    const statusRes = await api.get('/verification/status');
                    if (statusRes.data.isVerified) {
                        const updatedUser = { ...userData, isSenderVerified: true };
                        setUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        if (refreshSubscription) refreshSubscription();
                    } else {
                        setUser(userData);
                        if (refreshSubscription) refreshSubscription();
                    }
                } catch {
                    setUser({ ...userData, isSenderVerified: false });
                    if (refreshSubscription) refreshSubscription();
                }
            } catch {
                setUser(null);
                toast.error('Your session may have expired. Please log in again.');
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [navigate]);

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
            const userRes = await api.get('/auth/me');
            setUser(userRes.data);
            if (refreshSubscription) refreshSubscription();
            setStatusMessage(`Status: ${res.data.status}`);
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Failed to check status.');
        }
    };

    const handleStartTrial = async () => {
        const toastId = toast.loading('Starting your trial...');
        try {
            await api.post('/subscription/start-trial');
            await fetchUser();
            if (refreshSubscription) refreshSubscription();
            toast.success('Your 7-day trial has started!', { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not start trial.', { id: toastId });
        }
    };

    const handleBuySubscription = async () => {
        const res = await loadRazorpay();
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            return;
        }
        const toastId = toast.loading('Creating your order...');
        try {
            const { data: order } = await api.post('/payment/create-order');
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'EchoMail Subscription',
                description: 'Standard Plan - Monthly',
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await api.post('/payment/verify', response);
                        if (refreshSubscription) refreshSubscription();
                        navigate('/payment/success');
                    } catch (error) {
                        navigate('/payment/failure');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#2563eb',
                },
            };
            toast.dismiss(toastId);
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            toast.error('Could not create order. Please try again.', { id: toastId });
        }
    };

    // Subscription Card Content
    const renderSubscriptionBox = () => {
        if (!user || !user.subscription) return null;
        const { status, trialEndsAt, subscriptionEndsAt } = user.subscription;
        const isTrialExpired = status === 'trial' && new Date(trialEndsAt) < new Date();
        let badge, statusText, actions = null;
        if (status === 'active') {
            badge = <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">Active</span>;
            statusText = (
                <p className="text-gray-700 font-medium mb-2">
                  Your subscription is active until
                  <br />
                  <span className="font-semibold">
                    {new Date(subscriptionEndsAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>.
                </p>
            );
        } else if (status === 'trial' && !isTrialExpired) {
            badge = <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">Trial</span>;
            statusText = (
                <p className="text-gray-700 font-medium mb-2">
                    You are on a free trial. It ends on
                    <br />
                    <span className="font-semibold">
                        {new Date(trialEndsAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>.
                </p>
            );
        } else {
            badge = <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold mb-2">No Subscription</span>;
            statusText = (
                <p className="text-gray-700 font-medium mb-2">{isTrialExpired ? 'Your trial has expired.' : 'You do not have an active subscription.'} Please subscribe to continue using all features.</p>
            );
            actions = (
                <div className="flex flex-col gap-3 mt-4">
                    {status === 'none' && (
                        <button
                            onClick={handleStartTrial}
                            className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <Star className="h-5 w-5" />
                            <span>Start 7-Day Free Trial</span>
                        </button>
                    )}
                    <button
                        onClick={handleBuySubscription}
                        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Crown className="h-5 w-5" />
                        <span>Buy Subscription - $5/month</span>
                    </button>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center">
                <Crown className="h-10 w-10 text-purple-600 mb-2" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Subscription Status</h3>
                {badge}
                {statusText}
                {actions}
            </div>
        );
    };

    // Email Verification Card Content
    const renderVerificationBox = () => (
        <div className="flex flex-col items-center">
            <Mail className="h-10 w-10 text-blue-600 mb-2" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sender Email Verification</h3>
            {user?.isSenderVerified ? (
                <div className="flex items-center space-x-2 bg-green-50 text-green-800 px-4 py-2 rounded-xl border border-green-200 mt-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Your email address is verified and can be used to send campaigns.</span>
                </div>
            ) : (
                <>
                    <div className="flex items-center space-x-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-xl border border-yellow-200 mt-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-medium">Your email is not verified.</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-4 w-full">
                        <button
                            onClick={handleStartVerification}
                            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Send Verification Email
                        </button>
                        <button
                            onClick={handleCheckStatus}
                            className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Check Status</span>
                        </button>
                    </div>
                    {statusMessage && <p className="text-sm text-gray-700 mt-3 text-center">{statusMessage}</p>}
                </>
            )}
        </div>
    );

    // Features Card Content
    const renderFeaturesBox = () => (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
                <Crown className="h-7 w-7 text-purple-600" />
                <span className="text-lg font-bold text-gray-900">Your Plan Features</span>
            </div>
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">Standard Plan</span>
            <ul className="space-y-3 w-full max-w-xs">
                {planFeatures.map(feature => (
                    <li key={feature} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    if (loading) {
        return <div className="p-6 text-center">Loading profile...</div>;
    }

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your account, subscription, and sender settings.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Features Card */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center"
                >
                    {renderFeaturesBox()}
                </motion.div>
                {/* Subscription Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center"
                >
                    {renderSubscriptionBox()}
                </motion.div>
                {/* Email Verification Card */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center"
                >
                    {renderVerificationBox()}
                </motion.div>
            </div>
        </div>
    );
}