import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="text-blue-200"> Email Marketing?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join 50,000+ businesses already using EchoMail to grow their revenue with powerful email campaigns.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate('/register')}
            >
              <Send className="h-5 w-5" />
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
          
          
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;