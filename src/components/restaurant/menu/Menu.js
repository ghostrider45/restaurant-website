import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddMenuItem from './AddMenuItem';
import ManageMenu from './ManageMenu';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('add'); // Default to 'add' tab

  // Check if there's a tab parameter in the URL
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'manage') {
      setActiveTab('manage');
    } else {
      setActiveTab('add');
    }
  }, [location.search]);

  // Function to change tabs
  const changeTab = (tab) => {
    setActiveTab(tab);
    navigate(`/restaurant/menu?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
            <button
              onClick={() => navigate('/restaurant/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === 'add'
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => changeTab('add')}
            >
              Add Menu Item
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === 'manage'
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => changeTab('manage')}
            >
              Manage Menu Items
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'add' ? <AddMenuItem /> : <ManageMenu />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;
