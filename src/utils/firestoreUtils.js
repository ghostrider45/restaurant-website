import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Flag to enable detailed logging
const ENABLE_LOGGING = true;

/**
 * Save data to Firestore
 * @param {string} collectionName - The collection name
 * @param {string} documentId - The document ID (optional, will be auto-generated if not provided)
 * @param {Object} data - The data to save
 * @param {boolean} merge - Whether to merge with existing data (default: false)
 * @returns {Promise<string>} - The document ID
 */
export const saveToFirestore = async (collectionName, documentId, data, merge = false) => {
  try {
    if (ENABLE_LOGGING) {
      console.log(`Saving to Firestore: ${collectionName}/${documentId || 'auto-id'}`);
      console.log('Data:', JSON.stringify(data, null, 2));
    }

    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      updatedAt: serverTimestamp()
    };

    if (!data.createdAt) {
      dataWithTimestamps.createdAt = serverTimestamp();
    }

    let docRef;

    if (documentId) {
      // Use provided document ID
      docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, dataWithTimestamps, { merge });
      return documentId;
    } else {
      // Auto-generate document ID
      docRef = await addDoc(collection(db, collectionName), dataWithTimestamps);
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error saving to Firestore (${collectionName}):`, error);
    throw error;
  }
};

/**
 * Get data from Firestore
 * @param {string} collectionName - The collection name
 * @param {string} documentId - The document ID
 * @returns {Promise<Object|null>} - The document data or null if not found
 */
export const getFromFirestore = async (collectionName, documentId) => {
  try {
    if (ENABLE_LOGGING) {
      console.log(`Getting from Firestore: ${collectionName}/${documentId}`);
    }

    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log(`Document not found: ${collectionName}/${documentId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting from Firestore (${collectionName}/${documentId}):`, error);
    throw error;
  }
};
