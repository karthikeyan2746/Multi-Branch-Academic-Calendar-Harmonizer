import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await api.get('/api/branches');
      setBranches(response.data);
    } catch (error) {
      toast.error('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    branchCode: '',
    branchName: '',
    contactEmail: ''
  });

  const toggleBranchStatus = async (branchId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/branches/${branchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ active: !currentStatus })
      });
      
      if (response.ok) {
        setBranches(branches.map(branch => 
          branch.id === branchId 
            ? { ...branch, active: !currentStatus }
            : branch
        ));
        toast.success(`Branch ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error('Failed to update branch status');
    }
  };

  const deleteBranch = async (branchId) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/branches/${branchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setBranches(branches.filter(branch => branch.id !== branchId));
        toast.success('Branch deleted successfully');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete branch');
    }
  };

  const addBranch = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBranch)
      });
      
      if (response.ok) {
        const createdBranch = await response.json();
        setBranches([...branches, createdBranch]);
        setNewBranch({ branchCode: '', branchName: '', contactEmail: '' });
        setShowAddModal(false);
        toast.success('Branch created successfully');
      } else {
        throw new Error('Failed to create');
      }
    } catch (error) {
      toast.error('Failed to create branch');
    }
  };

  if (!isAdmin()) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <div className="bg-white rounded-xl shadow-soft">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Branch Management</h2>
              <p className="text-slate-600 mt-1">Manage academic branches and their status</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus size={16} />
              <span>Add Branch</span>
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Branch Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Branch Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contact Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Sync
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {branches.map((branch) => (
                <motion.tr
                  key={branch.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-500 mr-3" />
                      <span className="text-sm font-medium text-slate-900">
                        {branch.branchCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-900">{branch.branchName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{branch.contactEmail}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {branch.lastSyncAt ? new Date(branch.lastSyncAt).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleBranchStatus(branch.id, branch.active)}
                      className="flex items-center space-x-2 group"
                    >
                      {branch.active ? (
                        <>
                          <ToggleRight className="text-green-500 group-hover:text-green-600" size={20} />
                          <span className="text-sm text-green-600 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="text-slate-400 group-hover:text-slate-500" size={20} />
                          <span className="text-sm text-slate-500 font-medium">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteBranch(branch.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {branches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No branches found</p>
          </div>
        )}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Branch</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Branch Code"
                value={newBranch.branchCode}
                onChange={(e) => setNewBranch({...newBranch, branchCode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Branch Name"
                value={newBranch.branchName}
                onChange={(e) => setNewBranch({...newBranch, branchName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Contact Email"
                value={newBranch.contactEmail}
                onChange={(e) => setNewBranch({...newBranch, contactEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addBranch}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BranchManagement;