import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Users, TrendingUp, Download, Filter } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ReportsPage = () => {
  const [reportData, setReportData] = useState({
    totalEvents: 0,
    totalBranches: 0,
    conflictsResolved: 0,
    upcomingEvents: 0
  });
  const [events, setEvents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // Fetch events
      const eventsResponse = await api.get('/api/events');
      const eventsData = eventsResponse.data || [];
      setEvents(eventsData);

      // Fetch branches
      const branchesResponse = await api.get('/api/branches');
      const branchesData = branchesResponse.data || [];
      setBranches(branchesData);

      // Calculate upcoming events
      const now = new Date();
      const upcomingEvents = eventsData.filter(event => 
        new Date(event.startDate) >= now
      ).length;

      // Calculate monthly data
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const thisMonthEvents = eventsData.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear;
      }).length;

      setReportData({
        totalEvents: eventsData.length,
        totalBranches: branchesData.length,
        conflictsResolved: 0, // This would come from conflicts API
        upcomingEvents: upcomingEvents
      });
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyData = () => {
    const monthlyStats = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with 0
    months.forEach((month, index) => {
      monthlyStats[month] = { events: 0, conflicts: 0 };
    });

    // Count events by month
    events.forEach(event => {
      const eventDate = new Date(event.startDate);
      const monthIndex = eventDate.getMonth();
      const monthName = months[monthIndex];
      if (monthlyStats[monthName]) {
        monthlyStats[monthName].events++;
      }
    });

    return Object.entries(monthlyStats).map(([month, data]) => ({
      month,
      events: data.events,
      conflicts: data.conflicts
    }));
  };

  const getBranchData = () => {
    if (branches.length === 0) return [];
    
    return branches.map(branch => {
      const branchEvents = events.filter(event => event.branchId === branch.id);
      const utilization = branchEvents.length > 0 ? Math.min((branchEvents.length / 10) * 100, 100) : 0;
      
      return {
        name: branch.branchName || branch.branchCode,
        events: branchEvents.length,
        utilization: Math.round(utilization)
      };
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading reports..." />;
  }

  const monthlyData = getMonthlyData();
  const branchData = getBranchData();

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time insights from your academic calendar data</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors opacity-50 cursor-not-allowed">
            <Filter className="h-4 w-4" />
            <span>Filter (Coming Soon)</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors opacity-50 cursor-not-allowed">
            <Download className="h-4 w-4" />
            <span>Export (Coming Soon)</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.totalEvents}</p>
              <p className="text-sm text-blue-600 font-medium">All time</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Branches</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.totalBranches}</p>
              <p className="text-sm text-green-600 font-medium">Configured</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.upcomingEvents}</p>
              <p className="text-sm text-purple-600 font-medium">Next 30 days</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {events.filter(e => {
                  const eventDate = new Date(e.startDate);
                  const now = new Date();
                  return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-sm text-orange-600 font-medium">Current month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Events Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Events Distribution</h3>
          {monthlyData.length > 0 ? (
            <div className="space-y-4">
              {monthlyData.slice(0, 6).map((data, index) => (
                <div key={data.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max((data.events / Math.max(...monthlyData.map(d => d.events), 1)) * 100, 2)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{data.events}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No events data available</p>
            </div>
          )}
        </motion.div>

        {/* Branch Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Branch Event Distribution</h3>
          {branchData.length > 0 ? (
            <div className="space-y-4">
              {branchData.map((branch, index) => (
                <div key={branch.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{branch.name}</span>
                    <span className="text-sm text-gray-600">{branch.events} events</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(branch.utilization, 2)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{branch.utilization}% activity</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No branches configured</p>
              <p className="text-sm mt-1">Add branches to see distribution</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;