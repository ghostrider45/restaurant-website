import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { saveToFirestore, getFromFirestore } from '../utils/firestoreUtils';

const FirestoreTest = () => {
  const { user } = useUser();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testWrite = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Skip authentication - we're using open Firestore rules

      // Create test data
      const testData = {
        id: user.id,
        testField: 'Test value',
        testTime: new Date().toISOString()
      };

      // Write to Firestore using our utility
      console.log('Writing test data to Firestore...');
      await saveToFirestore('test', user.id, testData);

      // Read from Firestore to verify
      console.log('Reading test data from Firestore...');
      const data = await getFromFirestore('test', user.id);

      if (data) {
        setResult(data);
      } else {
        setError('Document not found after writing');
      }
    } catch (err) {
      console.error('Firestore test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Firestore Permissions Test</h2>

      {user ? (
        <div>
          <p className="mb-2">Logged in as: {user.fullName} ({user.id})</p>
          <button
            onClick={testWrite}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Testing...' : 'Test Firestore Write'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="mt-4">
              <h3 className="font-medium">Test Result:</h3>
              <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <p>Please log in to test Firestore permissions</p>
      )}
    </div>
  );
};

export default FirestoreTest;
