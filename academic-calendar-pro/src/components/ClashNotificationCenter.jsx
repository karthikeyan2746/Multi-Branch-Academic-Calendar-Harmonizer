import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ClashNotificationCenter = () => {
  const [clashes, setClashes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClashes();
  }, []);

  const fetchClashes = async () => {
    try {
      const response = await api.get('/api/clashes/unresolved');
      setClashes(response.data);
    } catch (error) {
      console.error('Failed to fetch clashes:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveClash = async (clashId) => {
    try {
      await api.put(`/api/clashes/${clashId}/resolve`);
      setClashes(clashes.filter(clash => clash.id !== clashId));
      toast.success('Conflict resolved successfully');
    } catch (error) {
      toast.error('Failed to resolve conflict');
    }
  };

  const dismissClash = (clashId) => {
    setClashes(clashes.filter(clash => clash.id !== clashId));
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'border-red-500 bg-red-50';
      case 'MEDIUM': return 'border-orange-500 bg-orange-50';
      case 'LOW': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-red-500 bg-red-50';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'text-red-700';
      case 'MEDIUM': return 'text-orange-700';
      case 'LOW': return 'text-yellow-700';
      default: return 'text-red-700';
    }
  };

  if (loading) return null;
  if (clashes.length === 0) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="text-red-500" size={20} />
        <h3 className="text-lg font-semibold text-red-700">
          Scheduling Conflicts ({clashes.length})
        </h3>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {clashes.map((clash) => (
            <motion.div
              key={clash.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`border-l-4 rounded-lg p-4 shadow-soft ${getSeverityColor(clash.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-sm font-medium px-2 py-1 rounded ${getSeverityTextColor(clash.severity)} bg-white/50`}>
                      {clash.severity} PRIORITY
                    </span>
                    <span className="text-sm text-slate-600">
                      {clash.clashType}
                    </span>
                  </div>
                  
                  <p className={`font-medium ${getSeverityTextColor(clash.severity)}`}>
                    Scheduling Conflict Detected
                  </p>
                  
                  {clash.details && (
                    <p className="text-sm text-slate-600 mt-1">
                      {clash.details}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-3 mt-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => resolveClash(clash.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={14} />
                      <span>Resolve</span>
                    </motion.button>
                    
                    <button
                      onClick={() => dismissClash(clash.id)}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => dismissClash(clash.id)}
                  className="text-slate-400 hover:text-slate-600 ml-4"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ClashNotificationCenter;