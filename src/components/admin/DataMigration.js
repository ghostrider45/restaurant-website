import React, { useState } from 'react';
import { migrateMenuItems, testFetchMenuItems } from '../../utils/migrateMenuItems';

const DataMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [testStatus, setTestStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMigration = async () => {
    if (window.confirm('Are you sure you want to migrate menu items? This operation cannot be undone.')) {
      setLoading(true);
      try {
        const result = await migrateMenuItems();
        setMigrationStatus(result);
      } catch (error) {
        setMigrationStatus({ success: false, error: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTest = async () => {
    setLoading(true);
    try {
      const result = await testFetchMenuItems();
      setTestStatus(result);
    } catch (error) {
      setTestStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Data Migration Tool</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Migrate Menu Items</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This tool will migrate menu items from restaurant subcollections to a top-level menuItems collection.
          Each menu item will include a reference to its restaurant.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleMigration}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Run Migration'}
          </button>
          <button
            onClick={handleTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Test Fetch'}
          </button>
        </div>
      </div>
      
      {migrationStatus && (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 ${
          migrationStatus.success ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
        }`}>
          <h2 className="text-xl font-semibold mb-2">Migration Result</h2>
          {migrationStatus.success ? (
            <p className="text-green-600 dark:text-green-400">
              Migration completed successfully! Migrated {migrationStatus.count} menu items.
            </p>
          ) : (
            <p className="text-red-600 dark:text-red-400">
              Migration failed: {migrationStatus.error}
            </p>
          )}
        </div>
      )}
      
      {testStatus && (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${
          testStatus.success ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
        }`}>
          <h2 className="text-xl font-semibold mb-2">Test Result</h2>
          {testStatus.success ? (
            <div>
              <p className="text-green-600 dark:text-green-400 mb-4">
                Found {testStatus.count} menu items in the top-level collection.
              </p>
              {testStatus.items && testStatus.items.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Sample Items:</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto max-h-96">
                    <pre className="text-sm">{JSON.stringify(testStatus.items, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-600 dark:text-red-400">
              Test failed: {testStatus.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DataMigration;
