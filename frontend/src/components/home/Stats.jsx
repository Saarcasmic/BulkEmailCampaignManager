import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { number: "50K+", label: "Happy Customers", color: "from-blue-500 to-blue-600" },
    { number: "10M+", label: "Emails Sent Monthly", color: "from-purple-500 to-purple-600" },
    { number: "98%", label: "Delivery Rate", color: "from-green-500 to-green-600" },
    { number: "24/7", label: "Expert Support", color: "from-orange-500 to-orange-600" }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="text-center group"
            >
              <div className={`bg-gradient-to-r ${stat.color} rounded-3xl p-8 mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-white/20`}>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;