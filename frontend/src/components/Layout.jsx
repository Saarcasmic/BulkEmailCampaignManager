import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, FileText, BarChart3, LogOut, User as UserIcon, Users as UsersIcon, Settings } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  } catch {
    return null;
  }
}

const menuItems = [
  { id: 'campaigns', label: 'Campaigns', icon: Send, path: '/campaigns' },
  { id: 'templates', label: 'Templates', icon: FileText, path: '/templates' },
  { id: 'metrics', label: 'Real Time Metrics', icon: BarChart3, path: '/analytics' },
  { id: 'profile', label: 'Profile', icon: Settings, path: '/profile' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  // Determine active tab based on current route
  const getActiveTab = () => {
    if (location.pathname.startsWith('/campaigns')) return 'campaigns';
    if (location.pathname.startsWith('/templates')) return 'templates';
    if (location.pathname.startsWith('/analytics')) return 'metrics';
    if (location.pathname.startsWith('/users')) return 'users';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return '';
  };
  const activeTab = getActiveTab();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EchoMail
            </span>
          </div>
          {/* User Profile */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{user?.name || 'User'}</div>
              <div className="text-sm text-gray-500">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</div>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
            {/* Conditionally render Users tab for admin */}
            {user && user.role === 'admin' && (
              <motion.button
                key="users"
                onClick={() => navigate('/users')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <UsersIcon className="h-5 w-5" />
                <span className="font-medium">Users</span>
              </motion.button>
            )}
          </div>
        </nav>
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen bg-[#f8fafc]">
        <Outlet />
      </div>
    </div>
  );
} 