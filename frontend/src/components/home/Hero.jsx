import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Mail, Users, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
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
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-pink-200/30 rounded-full blur-2xl"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -8, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Zap className="w-4 h-4 mr-2" />
              #1 Email Marketing Platform
            </motion.div>

            {/* Main headline */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                Grow Your Business with
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Email Marketing
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Create, send, and track beautiful email campaigns that convert. 
                Reach your audience with personalized messages that drive results.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">50K+</div>
                <div className="text-sm text-slate-500">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">99.9%</div>
                <div className="text-sm text-slate-500">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">2M+</div>
                <div className="text-sm text-slate-500">Emails Sent</div>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full flex items-center justify-center" onClick={() => navigate('/register')}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right content - Dashboard mockup */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div 
              className="relative bg-white rounded-2xl shadow-2xl p-6 border border-slate-200/50"
              whileHover={{ 
                rotate: 0,
                scale: 1.02
              }}
              initial={{ rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-slate-800">EchoMail</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="space-y-4">
                {/* Campaign stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-800">12.5K</div>
                    <div className="text-xs text-slate-500">Subscribers</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-800">24.8%</div>
                    <div className="text-xs text-slate-500">Open Rate</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-100">
                    <Mail className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-800">1.2K</div>
                    <div className="text-xs text-slate-500">Sent Today</div>
                  </div>
                </div>

                {/* Campaign list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-800">Summer Sale Campaign</span>
                    </div>
                    <span className="text-xs text-slate-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-800">Newsletter #47</span>
                    </div>
                    <span className="text-xs text-slate-500">Scheduled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-800">Welcome Series</span>
                    </div>
                    <span className="text-xs text-slate-500">Draft</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div 
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <TrendingUp className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;