import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Calendar, Users, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    application: {
      autoSaveEvents: true,
      conflictDetection: true,
      emailReminders: false
    },
    calendar: {
      info: 'Calendar settings are managed automatically'
    },
    general: {
      timezone: 'UTC+05:30'
    }
  });

  useEffect(() => {
    // Load saved settings on component mount
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
    }
  }, []);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application preferences</p>
        </div>
        <button
          onClick={saveSettings}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </motion.div>

      <div className="grid gap-6">
        {/* Application Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Application Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-save Events</p>
                <p className="text-sm text-gray-500">Automatically save event changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.application?.autoSaveEvents || false}
                  onChange={(e) => handleSettingChange('application', 'autoSaveEvents', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Conflict Detection</p>
                <p className="text-sm text-gray-500">Automatically detect scheduling conflicts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.application?.conflictDetection || true}
                  onChange={(e) => handleSettingChange('application', 'conflictDetection', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Reminders</p>
                <p className="text-sm text-gray-500">Send email reminders for upcoming events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.application?.emailReminders || false}
                  onChange={(e) => handleSettingChange('application', 'emailReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Calendar Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
              <p className="text-sm text-gray-500 mb-2">Month view is currently active</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Week Starts On</label>
              <p className="text-sm text-gray-500 mb-2">Monday is currently set</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
              <p className="text-sm text-gray-500 mb-2">24-hour format is active</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Show Weekends</p>
                <p className="text-sm text-gray-500">Weekends are currently shown</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">General</h2>
          </div>
          
          <div className="grid md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.general.timezone}
                onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC+05:30">IST (UTC+05:30)</option>
                <option value="UTC+00:00">UTC (UTC+00:00)</option>
                <option value="UTC-05:00">EST (UTC-05:00)</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;