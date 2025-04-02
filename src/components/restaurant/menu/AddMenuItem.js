import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { uploadFileToStorage } from '../../../utils/firebaseStorage';
import { addMenuItem } from '../../../utils/menuUtils';

// Menu categories
const categories = [
  'Appetizers',
  'Soups',
  'Salads',
  'Main Course',
  'Sides',
  'Desserts',
  'Beverages',
  'Specials',
  'Breakfast',
  'Lunch',
  'Dinner'
];

const AddMenuItem = () => {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: '',
    spicyLevel: '0',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
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

  const uploadImage = async (userId, file) => {
    try {
      console.log('Uploading menu item image to Firebase Storage');

      // Use the Firebase Storage upload utility with a specific folder for menu items
      const result = await uploadFileToStorage(userId, file, 'menu');
      console.log('Menu item image upload successful:', result);

      return result;
    } catch (error) {
      console.error('Error uploading menu item image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!imageFile) {
        throw new Error('Please upload an image for the menu item');
      }

      // Step 1: Upload image
      const imageData = await uploadImage(user.id, imageFile);
      console.log('Image uploaded successfully:', imageData);

      // Step 2: Create menu item data
      const menuItemData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime, 10) || 0,
        spicyLevel: parseInt(formData.spicyLevel, 10) || 0,
        image: imageData,
        restaurantId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Step 3: Save to Firestore
      console.log('Saving menu item to Firestore:', menuItemData);

      // Use our utility function to add the menu item to Firestore
      const savedItem = await addMenuItem(user.id, menuItemData);
      console.log('Menu item saved successfully with ID:', savedItem.id);

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        preparationTime: '',
        spicyLevel: '0',
      });
      setImageFile(null);
      setImagePreview(null);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert(`Failed to add menu item: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Menu Item</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Menu item added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              value={formData.price}
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
            value={formData.category}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select a category</option>
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
            value={formData.description}
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
                checked={formData.isVegetarian}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isVegan"
                checked={formData.isVegan}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Vegan</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isGlutenFree"
                checked={formData.isGlutenFree}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Gluten Free</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
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
              value={formData.preparationTime}
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
              value={formData.spicyLevel}
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
              required
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600
                     transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {saving ? 'Adding...' : 'Add Menu Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenuItem;
