import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const schema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
  terms: yup.bool().oneOf([true], 'You must accept the terms'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const { name, email, password } = data;
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (localStorage.getItem('token')) {
        navigate('/campaigns');
      } else {
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Back to home button */}
        <Link 
          to="/"
          className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl mx-auto p-4 md:p-6 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">Create Account</h1>
            <p className="text-slate-600 text-sm md:text-base">Join thousands of businesses using our platform</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  {...register('name')}
                  className={`w-full pl-9 pr-4 py-2.5 md:py-3 border ${errors.name ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-slate-800 placeholder:text-slate-400 text-sm md:text-base`}
                  placeholder="Enter your full name"
                  required
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500">{errors.name.message}</span>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`w-full pl-9 pr-4 py-2.5 md:py-3 border ${errors.email ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-slate-800 placeholder:text-slate-400 text-sm md:text-base`}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500">{errors.email.message}</span>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="password" className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    {...register('password')}
                    className={`w-full pl-9 pr-12 py-2 md:py-2.5 border ${errors.password ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-slate-800 placeholder:text-slate-400 text-sm md:text-base`}
                    placeholder="Create a password"
                    required
                    disabled={isSubmitting}
                  />
                  <span
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-black" /> : <Eye className="h-5 w-5 text-black" />}
                  </span>
                  {errors.password && (
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-red-500">{errors.password.message}</span>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className={`w-full pl-9 pr-12 py-2 md:py-2.5 border ${errors.confirmPassword ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-slate-800 placeholder:text-slate-400 text-sm md:text-base`}
                    placeholder="Confirm your password"
                    required
                    disabled={isSubmitting}
                  />
                  <span
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-black" /> : <Eye className="h-5 w-5 text-black" />}
                  </span>
                  {errors.confirmPassword && (
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-red-500">{errors.confirmPassword.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                {...register('terms')}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-xs md:text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                  Privacy Policy
                </a>
              </span>
              {errors.terms && (
                <span className="ml-2 text-xs text-red-500">{errors.terms.message}</span>
              )}
            </div>

            {/* Create Account Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 md:py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 text-sm md:text-base"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-4 md:my-5 flex items-center">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="px-3 md:px-4 text-xs md:text-sm text-slate-500">or</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-slate-600 text-xs md:text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 