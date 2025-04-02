import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Get all menu items for a restaurant
 * @param {string} restaurantId - The restaurant ID
 * @returns {Promise<Array>} - Array of menu items
 */
export const getMenuItems = async (restaurantId) => {
  try {
    console.log('Fetching menu items for restaurant:', restaurantId);

    // Reference to the menu items subcollection for this restaurant
    const menuItemsRef = collection(db, 'restaurants', restaurantId, 'menuItems');

    // Get all documents in the collection
    const querySnapshot = await getDocs(menuItemsRef);

    // Convert the query snapshot to an array of menu items
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`Found ${menuItems.length} menu items`);
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

/**
 * Add a new menu item
 * @param {string} restaurantId - The restaurant ID
 * @param {Object} menuItemData - The menu item data
 * @returns {Promise<Object>} - The added menu item with ID
 */
export const addMenuItem = async (restaurantId, menuItemData) => {
  try {
    console.log('Adding menu item for restaurant:', restaurantId);

    // Add timestamps
    const dataWithTimestamps = {
      ...menuItemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Reference to the menu items subcollection for this restaurant
    const menuItemsRef = collection(db, 'restaurants', restaurantId, 'menuItems');

    // Add the document to the collection
    const docRef = await addDoc(menuItemsRef, dataWithTimestamps);

    console.log('Menu item added with ID:', docRef.id);

    // Return the added menu item with ID
    return {
      id: docRef.id,
      ...menuItemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

/**
 * Update a menu item
 * @param {string} restaurantId - The restaurant ID
 * @param {string} menuItemId - The menu item ID
 * @param {Object} menuItemData - The menu item data
 * @returns {Promise<void>}
 */
export const updateMenuItem = async (restaurantId, menuItemId, menuItemData) => {
  try {
    console.log('Updating menu item:', menuItemId, 'for restaurant:', restaurantId);

    // Add timestamp
    const dataWithTimestamp = {
      ...menuItemData,
      updatedAt: serverTimestamp()
    };

    // Reference to the specific menu item document
    const menuItemRef = doc(db, 'restaurants', restaurantId, 'menuItems', menuItemId);

    // Update the document
    await updateDoc(menuItemRef, dataWithTimestamp);

    console.log('Menu item updated successfully');
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

/**
 * Update menu item availability
 * @param {string} restaurantId - The restaurant ID
 * @param {string} menuItemId - The menu item ID
 * @param {boolean} isAvailable - The availability status
 * @returns {Promise<void>}
 */
export const updateMenuItemAvailability = async (restaurantId, menuItemId, isAvailable) => {
  try {
    console.log('Updating menu item availability:', menuItemId, 'to', isAvailable);

    // Reference to the specific menu item document
    const menuItemRef = doc(db, 'restaurants', restaurantId, 'menuItems', menuItemId);

    // Update only the availability and timestamp
    await updateDoc(menuItemRef, {
      isAvailable: isAvailable,
      updatedAt: serverTimestamp()
    });

    console.log('Menu item availability updated successfully');
  } catch (error) {
    console.error('Error updating menu item availability:', error);
    throw error;
  }
};

/**
 * Delete a menu item
 * @param {string} restaurantId - The restaurant ID
 * @param {string} menuItemId - The menu item ID
 * @returns {Promise<void>}
 */
export const deleteMenuItem = async (restaurantId, menuItemId) => {
  try {
    console.log('Deleting menu item:', menuItemId, 'for restaurant:', restaurantId);

    // Reference to the specific menu item document
    const menuItemRef = doc(db, 'restaurants', restaurantId, 'menuItems', menuItemId);

    // Delete the document
    await deleteDoc(menuItemRef);

    console.log('Menu item deleted successfully');
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};
