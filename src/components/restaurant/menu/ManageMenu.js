import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { uploadFileToStorage } from '../../../utils/firebaseStorage';
import { getMenuItems, updateMenuItem, updateMenuItemAvailability, deleteMenuItem } from '../../../utils/menuUtils';

const ManageMenu = () => {
  const { user } = useUser();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!user) return;

      try {
        // Fetch menu items from Firestore
        console.log('Fetching menu items for restaurant:', user.id);

        // Use our utility function to get menu items from Firestore
        let menuItemsCollection = [];
        try {
          menuItemsCollection = await getMenuItems(user.id);
        } catch (firestoreError) {
          console.error('Error fetching from Firestore:', firestoreError);
          // Continue with sample data if Firestore fetch fails
        }

        // Sample data for demonstration if no items are found
        const sampleMenuItems = [
          {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 299,
            category: 'Main Course',
            isVegetarian: true,
            isVegan: false,
            isGlutenFree: false,
            isAvailable: true,
            preparationTime: 20,
            spicyLevel: 1,
            image: {
              url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
              path: 'restaurants/sample/menu/pizza.jpg'
            }
          },
          {
            id: '2',
            name: 'Chocolate Brownie',
            description: 'Rich chocolate brownie served with vanilla ice cream',
            price: 199,
            category: 'Desserts',
            isVegetarian: true,
            isVegan: false,
            isGlutenFree: false,
            isAvailable: true,
            preparationTime: 10,
            spicyLevel: 0,
            image: {
              url: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e',
              path: 'restaurants/sample/menu/brownie.jpg'
            }
          },
          {
            id: '3',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
            price: 249,
            category: 'Salads',
            isVegetarian: true,
            isVegan: false,
            isGlutenFree: true,
            isAvailable: true,
            preparationTime: 15,
            spicyLevel: 0,
            image: {
              url: 'https://images.unsplash.com/photo-1551248429-40975aa4de74',
              path: 'restaurants/sample/menu/salad.jpg'
            }
          }
        ];

        // Use the API data or sample data if the API returned empty results
        const items = menuItemsCollection && menuItemsCollection.length > 0 ? menuItemsCollection : sampleMenuItems;
        setMenuItems(items);

        // Extract unique categories
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        setCategories(uniqueCategories);

        console.log('Menu items loaded:', items.length);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [user]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setImagePreview(item.image?.url || null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;

    setSaving(true);
    try {
      let imageData = editingItem.image;

      // Upload new image if selected
      if (imageFile) {
        imageData = await uploadFileToStorage(user.id, imageFile, 'menu');
      }

      // Update the menu item
      const updatedItem = {
        ...editingItem,
        price: parseFloat(editingItem.price),
        preparationTime: parseInt(editingItem.preparationTime, 10) || 0,
        spicyLevel: parseInt(editingItem.spicyLevel, 10) || 0,
        image: imageData,
        updatedAt: new Date().toISOString()
      };

      // Send update to Firestore
      console.log('Updating menu item:', updatedItem);

      // Use our utility function to update the menu item in Firestore
      await updateMenuItem(user.id, updatedItem.id, updatedItem);

      // Update local state
      setMenuItems(prev =>
        prev.map(item => item.id === updatedItem.id ? updatedItem : item)
      );

      // Clear editing state
      setEditingItem(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert(`Failed to update menu item: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      // Find the item to update
      const itemToUpdate = menuItems.find(item => item.id === id);
      if (!itemToUpdate) return;

      // We don't need to create a full updated item object for this API call
      // Just sending the availability status is enough

      // Send update to Firestore
      console.log('Toggling availability for item:', id, 'New status:', !currentStatus);

      // Use our utility function to update the menu item availability in Firestore
      await updateMenuItemAvailability(user.id, id, !currentStatus);

      // Update local state
      setMenuItems(prev =>
        prev.map(item => item.id === id ? {...item, isAvailable: !currentStatus} : item)
      );
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert(`Failed to update availability: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        // Send delete request to Firestore
        console.log('Deleting menu item:', id);

        // Use our utility function to delete the menu item from Firestore
        await deleteMenuItem(user.id, id);

        // Update local state
        setMenuItems(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert(`Failed to delete menu item: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading menu items...</div>;
  }

  if (editingItem) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Menu Item</h2>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        <form className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                name="name"
                value={editingItem.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={editingItem.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={editingItem.category}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={editingItem.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
          </div>

          {/* Dietary Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={editingItem.isVegetarian}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isVegan"
                  checked={editingItem.isVegan}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Vegan</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isGlutenFree"
                  checked={editingItem.isGlutenFree}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Gluten Free</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={editingItem.isAvailable}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Available</span>
              </label>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preparation Time (minutes)</label>
              <input
                type="number"
                name="preparationTime"
                value={editingItem.preparationTime}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Spicy Level (0-5)</label>
              <input
                type="range"
                name="spicyLevel"
                value={editingItem.spicyLevel}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="1"
                className="mt-1 block w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Not Spicy</span>
                <span>Mild</span>
                <span>Very Spicy</span>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">Leave empty to keep current image</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600
                       transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Menu Items</h2>

      {menuItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No menu items found. Add some items to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <span
                key={category}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm cursor-pointer hover:bg-orange-200"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Menu items list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map(item => (
              <div
                key={item.id}
                className={`border rounded-lg overflow-hidden flex ${!item.isAvailable ? 'opacity-60' : ''}`}
              >
                <div className="w-1/3">
                  <img
                    src={item.image?.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="font-medium">₹{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.isVegetarian && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Veg</span>
                    )}
                    {item.isVegan && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Vegan</span>
                    )}
                    {item.isGlutenFree && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">GF</span>
                    )}
                    {item.spicyLevel > 0 && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                        Spicy {Array(item.spicyLevel).fill('🌶️').join('')}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between mt-3">
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                      className={`px-2 py-1 text-xs rounded ${
                        item.isAvailable
                          ? 'bg-green-100 hover:bg-green-200 text-green-700'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
