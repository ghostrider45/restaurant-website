import React, { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const TestFirebase = () => {
  const [userId, setUserId] = useState('test-user-id');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const customerData = {
        id: userId,
        role: 'customer',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Saving test customer data to Firestore:', customerData);
      await setDoc(doc(db, 'customers', userId), customerData);
      setResult('Customer data saved successfully!');
    } catch (error) {
      console.error('Error saving customer data:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUser = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const customerDocRef = doc(db, 'customers', userId);
      console.log('Checking customer document at path:', customerDocRef.path);
      
      const customerDoc = await getDoc(customerDocRef);
      console.log('Customer document exists:', customerDoc.exists());
      
      if (customerDoc.exists()) {
        setResult(`User exists: ${JSON.stringify(customerDoc.data(), null, 2)}`);
      } else {
        setResult('User does not exist');
      }
    } catch (error) {
      console.error('Error checking customer data:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Test Firebase Connection</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleAddUser}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Adding...' : 'Add Test User'}
        </button>
        
        <button
          onClick={handleCheckUser}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
        >
          {loading ? 'Checking...' : 'Check User'}
        </button>
      </div>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TestFirebase;
