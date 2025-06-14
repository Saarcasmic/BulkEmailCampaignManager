import React from 'react';
import { Mail, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    "Product": ["Features", "Pricing", "Templates", "Integrations", "API"],
    "Company": ["About", "Blog", "Careers", "Press", "Partners"],
    "Support": ["Help Center", "Contact", "Status", "Community", "Documentation"],
    "Legal": ["Privacy", "Terms", "Security", "GDPR", "Cookies"]
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EchoMail</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              The world's most powerful email marketing platform. Grow your business with smart email automation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 EchoMail. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;