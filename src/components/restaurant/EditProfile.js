import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { uploadFileToStorage } from '../../utils/firebaseStorage';
import { saveToFirestore, getFromFirestore } from '../../utils/firestoreUtils';

const cuisineOptions = [
  'Italian', 'Indian', 'Chinese', 'Japanese', 'Mexican',
  'Thai', 'American', 'Mediterranean', 'French', 'Korean'
];

const EditProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    ownerName: '',
    restaurantName: '',
    email: '',
    phone: '',
    fssaiLicense: '',
    openingTime: '',
    closingTime: '',
    description: '',
    cuisineTypes: [],
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!user) return;

      try {
        // Get restaurant data
        const restaurantData = await getFromFirestore('restaurants', user.id);
        if (restaurantData) {
          // Pre-fill form with existing data
          setFormData({
            ownerName: restaurantData.ownerName || '',
            restaurantName: restaurantData.restaurantName || '',
            email: restaurantData.email || '',
            phone: restaurantData.phone || '',
            fssaiLicense: restaurantData.fssaiLicense || '',
            openingTime: restaurantData.openingTime || '',
            closingTime: restaurantData.closingTime || '',
            description: restaurantData.description || '',
            cuisineTypes: restaurantData.cuisineTypes || [],
            address: restaurantData.address || '',
            city: restaurantData.city || '',
            state: restaurantData.state || '',
            pincode: restaurantData.pincode || '',
          });

          // Set image preview if available
          if (restaurantData.restaurantImage && restaurantData.restaurantImage.url) {
            setImagePreview(restaurantData.restaurantImage.url);
          }
        } else {
          console.error('Restaurant document not found');
          alert('Restaurant profile not found. Redirecting to profile setup.');
          navigate('/restaurant/profile-setup');
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        alert('Error loading profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCuisineChange = (cuisine) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }));
  };

  const handleImageChange = async (e) => {
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
      console.log('Uploading image directly to Firebase Storage');
      console.log('User ID:', userId);
      console.log('File:', file.name, file.type, file.size);

      // Use the direct Firebase Storage upload utility
      // We're no longer using the folder parameter to simplify the structure
      const result = await uploadFileToStorage(userId, file);
      console.log('Upload successful:', result);

      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Step 1: Upload image if provided
      let imageData = null;
      if (imageFile) {
        try {
          imageData = await uploadImage(user.id, imageFile);
          console.log('Image uploaded successfully:', imageData);
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          // Continue with profile update even if image upload fails
          alert(`Image upload failed: ${imageError.message}. Your profile will be saved without updating the image.`);
        }
      }

      // Step 2: Create restaurant data object
      const restaurantData = {
        id: user.id,
        ownerName: formData.ownerName,
        restaurantName: formData.restaurantName,
        email: formData.email,
        phone: formData.phone,
        fssaiLicense: formData.fssaiLicense,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        description: formData.description,
        cuisineTypes: formData.cuisineTypes,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        // Only update image if a new one was uploaded
        ...(imageData && { restaurantImage: imageData }),
        isProfileComplete: true,
        // Timestamps will be added by the saveToFirestore utility
      };

      // Step 3: Save to Firestore using our utility function
      console.log('Updating restaurant data in Firestore:', restaurantData);
      try {
        await saveToFirestore('restaurants', user.id, restaurantData, true); // true for merge
        console.log('Restaurant data updated successfully');
        alert('Profile updated successfully!');
      } catch (firestoreError) {
        console.error('Firestore error details:', firestoreError.code, firestoreError.message);
        throw firestoreError;
      }

      // Step 4: Navigate back to dashboard
      console.log('Profile update complete, navigating to dashboard');
      navigate('/restaurant/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Restaurant Profile</h1>
            <button
              onClick={() => navigate('/restaurant/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Auto-filled fields from Clerk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* FSSAI License */}
            <div>
              <label className="block text-sm font-medium text-gray-700">FSSAI License Number</label>
              <input
                type="text"
                name="fssaiLicense"
                value={formData.fssaiLicense}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Operating Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Opening Time</label>
                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Closing Time</label>
                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Cuisine Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Types</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cuisineOptions.map(cuisine => (
                  <label key={cuisine} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.cuisineTypes.includes(cuisine)}
                      onChange={() => handleCuisineChange(cuisine)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{6}"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Restaurant Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Image</label>
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600
                         transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
