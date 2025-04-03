import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Utility function to migrate menu items from restaurant subcollections to a top-level collection
 */
export const migrateMenuItems = async () => {
  try {
    console.log('Starting menu items migration...');
    
    // Get all restaurants
    const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
    const restaurants = restaurantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${restaurants.length} restaurants`);
    
    // Create a new top-level menuItems collection
    const menuItemsCollection = collection(db, 'menuItems');
    
    // For each restaurant, get its menu items and add them to the top-level collection
    let totalMigratedItems = 0;
    
    for (const restaurant of restaurants) {
      console.log(`Processing restaurant: ${restaurant.name} (${restaurant.id})`);
      
      // Get menu items from the restaurant's subcollection
      const menuItemsSnapshot = await getDocs(collection(db, 'restaurants', restaurant.id, 'menuItems'));
      const menuItems = menuItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Found ${menuItems.length} menu items for restaurant: ${restaurant.name}`);
      
      // Add each menu item to the top-level collection
      for (const menuItem of menuItems) {
        // Add restaurant reference to the menu item
        const newMenuItem = {
          ...menuItem,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          // Add any other restaurant fields you want to include
        };
        
        // Remove the original ID to let Firestore generate a new one
        delete newMenuItem.id;
        
        // Add to the top-level collection
        await addDoc(menuItemsCollection, newMenuItem);
        totalMigratedItems++;
      }
    }
    
    console.log(`Migration complete! Migrated ${totalMigratedItems} menu items.`);
    return { success: true, count: totalMigratedItems };
  } catch (error) {
    console.error('Error migrating menu items:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Utility function to test fetching menu items from the top-level collection
 */
export const testFetchMenuItems = async () => {
  try {
    console.log('Testing menu items fetch from top-level collection...');
    
    // Get all menu items from the top-level collection
    const menuItemsSnapshot = await getDocs(collection(db, 'menuItems'));
    const menuItems = menuItemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${menuItems.length} menu items in top-level collection`);
    console.log('Sample menu items:', menuItems.slice(0, 3));
    
    return { success: true, count: menuItems.length, items: menuItems.slice(0, 5) };
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return { success: false, error: error.message };
  }
};
