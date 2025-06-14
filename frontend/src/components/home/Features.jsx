import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Calendar,      // for scheduling
  Send,          // for bulk sending
  BarChart3,     // for analytics
  PieChart,      // for advanced analytics
  FileText,      // for templates
  Users,         // for user/role management
  Database,      // for schema‑driven forms
  Lock,          // for auth & security
  Zap,           // for real-time updates
  Globe          // for webhook event tracking
} from 'lucide-react';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Campaign Management",
      description: "Create, edit, schedule, and delete bulk email campaigns with full timezone support and advanced cron-style scheduling."
    },
    {
      icon: <Send className="h-8 w-8" />,
      title: "Bulk & Scheduled Sending",
      description: "Send thousands of emails instantly or queue them for later delivery via deep SendGrid integration."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-Time Metrics",
      description: "Monitor delivery, opens, clicks, bounces, and more with live stats powered by Socket.IO."
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Visualize device usage, geographic reach, and engagement trends with interactive charts and tables."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Template Management",
      description: "Create, customize, and save reusable email templates for consistent branding and lightning‑fast campaign setup."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "User & Role Management",
      description: "Admins can add users, assign roles (admin/user), and enforce granular access control."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Schema-Driven Forms & Tables",
      description: "Dynamic JSON‑schema powered forms and tables ensure flexible, validated data entry and display."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-Time Updates",
      description: "Live campaign statuses and analytics refresh automatically—no page reload required."
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50/50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            🚀 EchoMail Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage, send, and analyze bulk email campaigns in real time.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100/50 backdrop-blur-sm"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl mb-6 inline-block group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
