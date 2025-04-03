import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Replace "Appetizers" category with "Fast Food" in all menu items
 * @param {string} restaurantId - The restaurant ID
 * @returns {Promise<number>} - Number of items updated
 */
export const replaceAppetizersCategory = async (restaurantId) => {
  try {
    console.log('Replacing "Appetizers" category with "Fast Food" for restaurant:', restaurantId);
    
    // Reference to the menu items subcollection for this restaurant
    const menuItemsRef = collection(db, 'restaurants', restaurantId, 'menuItems');
    
    // Get all documents in the collection
    const querySnapshot = await getDocs(menuItemsRef);
    
    let updatedCount = 0;
    
    // Process each document
    const updatePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      const menuItem = docSnapshot.data();
      
      // Check if the category is "Appetizers"
      if (menuItem.category === 'Appetizers') {
        console.log(`Updating menu item ${docSnapshot.id} from "Appetizers" to "Fast Food"`);
        
        // Reference to the specific menu item document
        const menuItemRef = doc(db, 'restaurants', restaurantId, 'menuItems', docSnapshot.id);
        
        // Update the category
        const updatePromise = updateDoc(menuItemRef, {
          category: 'Fast Food'
        }).then(() => {
          updatedCount++;
        });
        
        updatePromises.push(updatePromise);
      }
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    console.log(`Updated ${updatedCount} menu items`);
    return updatedCount;
  } catch (error) {
    console.error('Error replacing categories:', error);
    throw error;
  }
};
