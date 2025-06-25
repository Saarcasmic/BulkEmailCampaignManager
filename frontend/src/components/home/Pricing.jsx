import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Crown } from 'lucide-react';

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Actual features from the app
  const features = [
    "Campaign Management",
    "Bulk & Scheduled Sending",
    "Real-Time Metrics",
    "Advanced Analytics",
    "Template Management",
    "User & Role Management (Admin)",
    "Schema-Driven Forms & Tables",
    "Real-Time Updates",
    "Webhook Tracking",
    "Secure Auth & Role-Based Access"
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            One plan, all features. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-lg"
        >
          <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-blue-100 relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl mb-6 inline-block shadow-lg">
              <Crown className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard Plan</h3>
            <p className="text-gray-600 mb-6">Everything you need to run and analyze your email campaigns</p>
            <div className="mb-6 flex items-end justify-center">
              <span className="text-5xl font-bold text-gray-900">$5</span>
              <span className="text-gray-600 text-lg mb-1 ml-1">/month</span>
            </div>
            <button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 mb-8"
              onClick={() => {
                window.location.href = '/register';
              }}
            >
              Get Started
            </button>
            <ul className="space-y-3 w-full">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;