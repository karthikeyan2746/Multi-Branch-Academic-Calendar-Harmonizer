import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Calendar, Users, Shield, Mail, Lock, User } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    department: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Login attempt with:', formData.email);
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        console.log('Register attempt with:', {
          fullName: formData.fullName,
          email: formData.email,
          department: formData.department
        });
        await register(formData.fullName, formData.email, formData.password, formData.department);
        toast.success('Account created! Please login.');
        setIsLogin(true);
        setFormData({ 
          email: formData.email, 
          password: '', 
          fullName: '', 
          department: '' 
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          'Authentication failed';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="min-h-screen flex">
        {/* Hero Section */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-white/20 rounded-xl mr-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Academic Calendar Pro</h1>
              </div>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Streamline your academic scheduling across multiple branches with intelligent conflict detection and seamless coordination.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Calendar className="w-6 h-6 text-blue-200" />
                  <div>
                    <h3 className="font-semibold">Unified Calendar Management</h3>
                    <p className="text-sm text-blue-200">Centralized event scheduling and management</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Users className="w-6 h-6 text-blue-200" />
                  <div>
                    <h3 className="font-semibold">Multi-Branch Coordination</h3>
                    <p className="text-sm text-blue-200">Seamless collaboration across departments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-blue-200" />
                  <div>
                    <h3 className="font-semibold">Intelligent Conflict Detection</h3>
                    <p className="text-sm text-blue-200">Automatic scheduling conflict prevention</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to your account' : 'Join the academic community'}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Department"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center shadow-lg"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </motion.button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;