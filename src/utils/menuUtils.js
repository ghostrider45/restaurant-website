import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where
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

    // Reference to the top-level menuItems collection
    const menuItemsRef = collection(db, 'menuItems');
    
    // Create a query to filter by restaurantId
    const menuItemsQuery = query(menuItemsRef, where('restaurantId', '==', restaurantId));

    // Get all documents that match the query
    const querySnapshot = await getDocs(menuItemsQuery);

    // Convert the query snapshot to an array of menu items
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`Found ${menuItems.length} menu items for restaurant ${restaurantId}`);
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

/**
 * Add a new menu item
 * @param {string} restaurantId - The restaurant ID
 * @param {string} restaurantName - The restaurant name
 * @param {Object} menuItemData - The menu item data
 * @returns {Promise<Object>} - The added menu item with ID
 */
export const addMenuItem = async (restaurantId, restaurantName, menuItemData) => {
  try {
    console.log('Adding menu item for restaurant:', restaurantId);

    // Add restaurant reference and timestamps
    const dataWithMetadata = {
      ...menuItemData,
      restaurantId,
      restaurantName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Reference to the top-level menuItems collection
    const menuItemsRef = collection(db, 'menuItems');

    // Add the document to the collection
    const docRef = await addDoc(menuItemsRef, dataWithMetadata);

    console.log('Menu item added with ID:', docRef.id);

    // Return the added menu item with ID
    return {
      id: docRef.id,
      ...dataWithMetadata,
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
 * @param {string} menuItemId - The menu item ID
 * @param {Object} menuItemData - The menu item data
 * @returns {Promise<void>}
 */
export const updateMenuItem = async (menuItemId, menuItemData) => {
  try {
    console.log('Updating menu item:', menuItemId);

    // Get the current menu item to preserve restaurantId and restaurantName
    const menuItemRef = doc(db, 'menuItems', menuItemId);
    const menuItemDoc = await getDoc(menuItemRef);
    
    if (!menuItemDoc.exists()) {
      throw new Error(`Menu item with ID ${menuItemId} not found`);
    }
    
    const currentData = menuItemDoc.data();

    // Add timestamp and preserve restaurant reference
    const dataWithMetadata = {
      ...menuItemData,
      restaurantId: currentData.restaurantId,
      restaurantName: currentData.restaurantName,
      updatedAt: serverTimestamp()
    };

    // Update the document
    await updateDoc(menuItemRef, dataWithMetadata);

    console.log('Menu item updated successfully');
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

/**
 * Update menu item availability
 * @param {string} menuItemId - The menu item ID
 * @param {boolean} isAvailable - The availability status
 * @returns {Promise<void>}
 */
export const updateMenuItemAvailability = async (menuItemId, isAvailable) => {
  try {
    console.log('Updating menu item availability:', menuItemId, 'to', isAvailable);

    // Reference to the specific menu item document
    const menuItemRef = doc(db, 'menuItems', menuItemId);

    // Update only the availability field
    await updateDoc(menuItemRef, {
      isAvailable,
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
 * @param {string} menuItemId - The menu item ID
 * @returns {Promise<void>}
 */
export const deleteMenuItem = async (menuItemId) => {
  try {
    console.log('Deleting menu item:', menuItemId);

    // Reference to the specific menu item document
    const menuItemRef = doc(db, 'menuItems', menuItemId);

    // Delete the document
    await deleteDoc(menuItemRef);

    console.log('Menu item deleted successfully');
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

/**
 * Get a single menu item by ID
 * @param {string} menuItemId - The menu item ID
 * @returns {Promise<Object|null>} - The menu item or null if not found
 */
export const getMenuItem = async (menuItemId) => {
  try {
    console.log('Fetching menu item:', menuItemId);

    // Reference to the specific menu item document
    const menuItemRef = doc(db, 'menuItems', menuItemId);
    const menuItemDoc = await getDoc(menuItemRef);

    if (menuItemDoc.exists()) {
      return {
        id: menuItemDoc.id,
        ...menuItemDoc.data()
      };
    } else {
      console.log('Menu item not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};
