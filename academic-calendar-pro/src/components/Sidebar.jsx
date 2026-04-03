import { motion } from 'framer-motion';
import { Calendar, Users, AlertTriangle, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Calendar, label: 'Dashboard', path: '/dashboard', color: 'text-blue-600' },
    { icon: Users, label: 'Branches', path: '/branches', color: 'text-green-600' },
    { icon: AlertTriangle, label: 'Conflicts', path: '/clashes', color: 'text-orange-600' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'text-purple-600' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-80 bg-white shadow-2xl border-r border-gray-100 flex flex-col h-full lg:relative lg:translate-x-0 fixed left-0 top-0 z-50"
        style={{ display: isOpen || window.innerWidth >= 1024 ? 'flex' : 'none' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Academic Calendar</h1>
                <p className="text-sm text-gray-600 font-medium">Pro Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`sidebar-item group ${
                    isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
                  } transition-colors`}>
                    <Icon className={`h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="mb-4">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.fullName || user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize font-medium">
                  {user?.role?.toLowerCase() || 'Member'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;