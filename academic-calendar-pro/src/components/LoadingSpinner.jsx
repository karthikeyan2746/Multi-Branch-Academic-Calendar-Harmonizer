import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
        <Calendar className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-gray-600 font-medium"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;