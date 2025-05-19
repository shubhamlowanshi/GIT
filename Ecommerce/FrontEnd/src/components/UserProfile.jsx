import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.username,
        email: storedUser.email,
        phone: storedUser.phone || '',
        address: storedUser.address || '',
      });
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfile = async () => {
    if (!user || !user._id) return alert('User ID not found.');

    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action is irreversible.');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:3000/api/user/${user._id}`);
      if (res.status === 200) {
        localStorage.removeItem('user');
        localStorage.removeItem('profileImage');
        alert('Account deleted successfully!');
        window.location.href = '/';
      } else {
        alert('Failed to delete account.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Server error. Could not delete account.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!user || !user._id) return alert('User ID not found.');

    try {
      const res = await axios.put(`http://localhost:3000/api/user/${user._id}`, formData);

      if (res.status === 200) {
        setUser(res.data);
        setIsEditMode(false);
        localStorage.setItem('user', JSON.stringify(res.data));
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Server error. Could not update profile.');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading user data...
      </div>
    );
  }

  return (
      <div style={{ paddingTop: '75px' }}>
    <div className="bg-white min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-12">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src={profileImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full object-cover"
              style={{ height: '100px', width: '100px', borderRadius: '50%' }}
            />
            <div className="mt-6 flex justify-center">
              <label className="bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  style={{ marginLeft: '-20px' }}
                />
                <span className="text-sm font-medium">Change Profile Picture</span>
              </label>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {isEditMode ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="text-2xl font-bold"
                />
              ) : (
                <h2 className="text-2xl font-bold">{user.username}</h2>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 text-sm font-medium px-5 py-2 rounded-md transition"
                >
                  ✏️ {isEditMode ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 text-sm font-medium px-5 py-2 rounded-md transition"
                >
                  ⚙️ Settings
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700 space-y-2">
              {isEditMode ? (
                <>
                  <label className="block">
                    <span className="text-gray-700">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Phone</span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Address</span>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </label>
                </>
              ) : (
                <>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                  <p><strong>Bio:</strong> shopoholic | Enthusiast 🌐</p>
                </>
              )}
            </div>

            {isEditMode && (
              <div className="mt-4">
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-600 hover:bg-blue-700 text-black font-semibold px-6 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {showSettings && (
          <div className="mt-10 p-6 border border-red-300 rounded-xl bg-red-50 shadow-sm">
            <h3 className="text-xl font-semibold text-red-700 mb-3">⚠️ Account Settings</h3>
            <p className="text-sm text-gray-700 mb-5">
              This action is permanent. Deleting your account will remove all your data.
            </p>
            <button
              onClick={handleDeleteProfile}
              className="bg-red-600 hover:bg-red-700 text-black font-semibold px-6 py-2 rounded-md shadow transition"
            >
              🗑️ Delete My Account
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
