import React, { useState } from 'react';
import { Menu, X, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = ({fromHome}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EchoMail
            </span>
          </div>
          {fromHome && (
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</a>
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
          </nav>
          )}
          
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full flex items-center justify-center" onClick={() => navigate('/login')}>Sign In</button>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold" onClick={() => navigate('/register')}>
              Get Started Free
            </button>
          </div>
          
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 py-4"
          >
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-left font-semibold">
                Get Started Free
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;