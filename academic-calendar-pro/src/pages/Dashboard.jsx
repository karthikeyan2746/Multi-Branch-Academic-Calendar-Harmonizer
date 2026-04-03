import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../context/AuthContext';
import ClashNotificationCenter from '../components/ClashNotificationCenter';
import EventModal from '../components/EventModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Calendar, Users, TrendingUp, Clock, MapPin, Filter, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchEvents();
    fetchBranches();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/api/events');
      const calendarEvents = response.data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        backgroundColor: getBranchColor(event.branchId),
        borderColor: getBranchColor(event.branchId),
        extendedProps: {
          ...event
        }
      }));
      setEvents(calendarEvents);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await api.get('/api/branches');
      setBranches(response.data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  const getBranchColor = (branchId) => {
    const colors = {
      1: '#3B82F6', // Blue
      2: '#10B981', // Green  
      3: '#8B5CF6', // Purple
      4: '#F59E0B', // Orange
      5: '#EF4444', // Red
    };
    return colors[branchId] || '#6B7280';
  };

  const handleDateClick = (arg) => {
    if (isAdmin()) {
      setSelectedDate(arg.date);
      setSelectedEvent(null);
      setModalOpen(true);
    }
  };

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event.extendedProps);
    setSelectedDate(null);
    setModalOpen(true);
  };

  const handleEventSaved = () => {
    fetchEvents();
  };

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const now = new Date();
    return eventDate >= now;
  }).slice(0, 5);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back! Here's your academic calendar overview</p>
          </div>
          
          {isAdmin() && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedDate(new Date());
                setSelectedEvent(null);
                setModalOpen(true);
              }}
              className="btn-primary flex items-center space-x-3 text-lg px-8 py-4"
            >
              <Plus className="h-6 w-6" />
              <span>Create Event</span>
            </motion.button>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{events.length}</p>
                <p className="text-sm text-green-600 font-medium mt-1">+12% from last month</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Branches</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{branches.length}</p>
                <p className="text-sm text-blue-600 font-medium mt-1">All departments</p>
              </div>
              <div className="p-4 bg-green-100 rounded-2xl">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {events.filter(e => {
                    const eventDate = new Date(e.start);
                    const now = new Date();
                    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
                <p className="text-sm text-purple-600 font-medium mt-1">Scheduled events</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingEvents.length}</p>
                <p className="text-sm text-orange-600 font-medium mt-1">Next 7 days</p>
              </div>
              <div className="p-4 bg-orange-100 rounded-2xl">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Calendar - Takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-3"
          >
            {/* Clash Notifications */}
            <div className="mb-6">
              <ClashNotificationCenter />
            </div>

            {/* Calendar */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Academic Calendar</h2>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">Filter by branch</span>
                  </div>
                </div>

                {/* Branch Legend */}
                <div className="flex flex-wrap gap-4">
                  <span className="text-sm font-semibold text-gray-700">Branches:</span>
                  {branches.map((branch) => (
                    <div key={branch.id} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getBranchColor(branch.id) }}
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {branch.branchCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={events}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  height="auto"
                  eventDisplay="block"
                  dayMaxEvents={3}
                  moreLinkClick="popover"
                  eventMouseEnter={(info) => {
                    info.el.style.cursor = 'pointer';
                  }}
                  eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Upcoming Events */}
            <div className="card">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
              </div>
              <div className="p-6 space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div 
                        className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: event.backgroundColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.start).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {isAdmin() && (
              <div className="card">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button 
                    onClick={() => {
                      setSelectedDate(new Date());
                      setSelectedEvent(null);
                      setModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-blue-50 rounded-xl transition-colors border border-blue-200 hover:border-blue-300"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">Create Event</span>
                      <span className="text-xs text-gray-500">Add new academic event</span>
                    </div>
                  </button>
                  <Link 
                    to="/branches"
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-green-50 rounded-xl transition-colors border border-green-200 hover:border-green-300"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">Manage Branches</span>
                      <span className="text-xs text-gray-500">Configure branch settings</span>
                    </div>
                  </Link>
                  <Link 
                    to="/reports"
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-50 rounded-xl transition-colors border border-purple-200 hover:border-purple-300"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">View Reports</span>
                      <span className="text-xs text-gray-500">Analytics & insights</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        event={selectedEvent}
        onEventSaved={handleEventSaved}
      />
    </div>
  );
};

export default Dashboard;