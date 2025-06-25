import React from 'react';
import { Linkedin, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 text-gray-800 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold mb-2">Connect with the Founder</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.linkedin.com/in/saarcasmic/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-7 py-3 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-blue-800 rounded-full font-semibold transition-all duration-300 shadow-md gap-2 border border-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <Linkedin className="h-5 w-5" />
                Connect to Founder
              </a>
              <a
                href="https://wa.me/918791567123"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-7 py-3 bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 text-green-800 rounded-full font-semibold transition-all duration-300 shadow-md gap-2 border border-green-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} EchoMail. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
