import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Uploads a file to Firebase Storage
 * @param {string} userId - The user ID
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to (default: 'images')
 * @returns {Promise<{url: string, path: string}>} - The download URL and storage path
 */
export const uploadFileToStorage = async (userId, file, folder = 'images') => {
  try {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    if (!userId) {
      throw new Error('User ID is required for upload');
    }

    // Generate a unique filename to prevent collisions
    const timestamp = new Date().getTime();
    // const fileExtension = file.name.split('.').pop(); // Not used currently
    const uniqueFilename = `${timestamp}-${file.name}`;

    // Create a storage reference with a simpler structure
    // Format: restaurants/[restaurantId]/[filename]
    const storagePath = `restaurants/${userId}/${uniqueFilename}`;
    console.log('Uploading to Firebase Storage path:', storagePath);
    const storageRef = ref(storage, storagePath);

    // Upload the file
    console.log('Starting file upload...');
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully:', snapshot);

    // Get the download URL
    console.log('Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);

    return {
      url: downloadURL,
      path: storagePath
    };
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    // Provide more detailed error message
    if (error.code) {
      switch (error.code) {
        case 'storage/unauthorized':
          throw new Error('User does not have permission to access the storage location');
        case 'storage/canceled':
          throw new Error('User canceled the upload');
        case 'storage/unknown':
          throw new Error('Unknown error occurred during upload');
        default:
          throw new Error(`Firebase Storage error: ${error.message}`);
      }
    }
    throw error;
  }
};
