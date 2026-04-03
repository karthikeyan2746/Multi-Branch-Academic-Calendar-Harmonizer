import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, Users, X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ConflictPage = () => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    try {
      // First try to get conflicts from API
      const response = await api.get('/api/clashes');
      setConflicts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch conflicts from API, detecting locally:', error);
      
      // If API fails, detect conflicts locally
      try {
        const eventsResponse = await api.get('/api/events');
        const branchesResponse = await api.get('/api/branches');
        
        const events = eventsResponse.data || [];
        const branches = branchesResponse.data || [];
        
        // Simple conflict detection
        const detectedConflicts = [];
        for (let i = 0; i < events.length; i++) {
          for (let j = i + 1; j < events.length; j++) {
            const event1 = events[i];
            const event2 = events[j];
            
            if (event1.branchId === event2.branchId) {
              const start1 = new Date(event1.startDate);
              const end1 = new Date(event1.endDate);
              const start2 = new Date(event2.startDate);
              const end2 = new Date(event2.endDate);
              
              if (start1 <= end2 && start2 <= end1) {
                const branch = branches.find(b => b.id === event1.branchId);
                detectedConflicts.push({
                  id: `${event1.id}-${event2.id}`,
                  eventTitle1: event1.title,
                  eventTitle2: event2.title,
                  conflictDate: start1 > start2 ? start1.toISOString().split('T')[0] : start2.toISOString().split('T')[0],
                  severity: 'HIGH',
                  branchName: branch?.branchName || 'Unknown Branch'
                });
              }
            }
          }
        }
        
        setConflicts(detectedConflicts);
      } catch (detectionError) {
        console.error('Failed to detect conflicts:', detectionError);
        setConflicts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const resolveConflict = async (conflictId) => {
    try {
      await api.delete(`/api/clashes/${conflictId}`);
      setConflicts(conflicts.filter(c => c.id !== conflictId));
      toast.success('Conflict resolved successfully');
    } catch (error) {
      toast.error('Failed to resolve conflict');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading conflicts..." />;
  }

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conflict Management</h1>
          <p className="text-gray-600 mt-1">Resolve scheduling conflicts and overlaps</p>
        </div>
      </motion.div>

      <div className="grid gap-6">
        {conflicts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Conflicts Found</h3>
            <p className="text-gray-500">All events are properly scheduled without conflicts.</p>
          </div>
        ) : (
          conflicts.map((conflict) => (
            <motion.div
              key={conflict.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity} PRIORITY
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Conflicting Events</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="font-medium text-red-900">{conflict.eventTitle1}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="font-medium text-red-900">{conflict.eventTitle2}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(conflict.conflictDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{conflict.branchName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => resolveConflict(conflict.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Reschedule Event
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConflictPage;