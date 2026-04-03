import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Settings, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, branches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full block mx-auto mt-0.5"></span>
          </span>
        </button>
        
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="p-4 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No new notifications</p>
            </div>
          </div>
        )}

        <button 
          onClick={() => window.location.href = '/settings'}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </button>

        <div className="relative">
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.name || user?.fullName || 'User'}
            </span>
          </div>
          
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{user?.name || user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">{user?.role || 'REVIEWER'}</p>
              </div>
              <div className="py-2">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile Settings</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Preferences</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;