import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { FaUserCircle, FaStar, FaEnvelope, FaPhone, FaBirthdayCake, FaUserGraduate, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';

const Profile = ({ isLoggedIn, onLogout, currentUser, onUpdateProfile }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || 'Student Name',
    email: currentUser?.email || 'student@example.com',
    phone: currentUser?.phone || '+91 9876543210',
    birthday: currentUser?.birthday || 'Jan 1, 2002',
    gender: currentUser?.gender || 'Not specified',
    roll: currentUser?.roll || 'GLB2021CS123',
    branch: currentUser?.branch || 'Computer Science',
    year: currentUser?.year || '3rd Year',
    location: currentUser?.location || 'GL Bajaj, Greater Noida',
    role: currentUser?.role || 'B.Tech CSE, 3rd Year',
    cgpa: currentUser?.cgpa || '8.7',
    skills: (currentUser?.skills && Array.isArray(currentUser.skills)) ? currentUser.skills : ['C++', 'React', 'DSA'],
    avatarUrl: currentUser?.avatarUrl || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatarUrl || '');

  // Example college user data (replace with real data as needed)
  const user = {
    ...editData,
    avatarUrl: avatarPreview || '',
  };

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    // If skills is a string, split by comma and trim
    const updatedProfile = {
      ...editData,
      skills: typeof editData.skills === 'string' ? editData.skills.split(',').map(s => s.trim()).filter(Boolean) : editData.skills,
      avatarUrl: avatarPreview,
    };
    setEditData(updatedProfile);
    setIsEditing(false);
    // Persist to parent/global state if callback provided
    if (onUpdateProfile) {
      onUpdateProfile(updatedProfile);
    }
    // Optionally show a success message
  };

  const handleEditCancel = () => {
    setEditData({
      name: currentUser?.name || 'Student Name',
      email: currentUser?.email || 'student@example.com',
      phone: currentUser?.phone || '+91 9876543210',
      birthday: currentUser?.birthday || 'Jan 1, 2002',
      gender: currentUser?.gender || 'Not specified',
      roll: currentUser?.roll || 'GLB2021CS123',
      branch: currentUser?.branch || 'Computer Science',
      year: currentUser?.year || '3rd Year',
      location: currentUser?.location || 'GL Bajaj, Greater Noida',
      role: currentUser?.role || 'B.Tech CSE, 3rd Year',
      cgpa: currentUser?.cgpa || '8.7',
      skills: (currentUser?.skills && Array.isArray(currentUser.skills)) ? currentUser.skills : ['C++', 'React', 'DSA'],
      avatarUrl: currentUser?.avatarUrl || '',
    });
    setAvatarPreview(currentUser?.avatarUrl || '');
    setIsEditing(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/avatar', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
        const data = await response.json();
        if (data.avatarUrl) {
          setAvatarPreview(data.avatarUrl);
          setEditData((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
        }
      } catch (err) {
        // Optionally show error
        console.error('Avatar upload failed', err);
      }
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-2">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-0 md:p-0 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Avatar & Main Info */}
          <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col items-center justify-center p-8">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4" />
            ) : (
              <FaUserCircle className="w-32 h-32 text-gray-300 bg-white rounded-full border-4 border-white shadow-lg mb-4" />
            )}
            {isEditing && (
              <div className="mb-4 flex flex-col items-center">
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-blue-700 transition flex items-center gap-2">
                  <FaCamera /> Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
                {avatarPreview && <span className="text-xs text-gray-500 mt-1">Preview</span>}
            </div>
          )}
            {!isEditing ? (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">{user.name}</h1>
                <div className="text-blue-600 font-medium text-center mb-1">{user.role}</div>
                <div className="flex items-center justify-center text-gray-500 text-sm mb-2">
                  <FaMapMarkerAlt className="mr-1" /> {user.location}
                </div>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <span className="text-lg font-semibold text-gray-700">{user.cgpa}</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">CGPA</span>
                </div>
              </>
            ) : (
              <>
                <input name="name" value={editData.name} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg mb-2 text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Name" />
                <input name="role" value={editData.role} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg mb-2 text-center text-blue-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Role (e.g. B.Tech CSE, 3rd Year)" />
                <input name="location" value={editData.location} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg mb-2 text-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Location" />
                <div className="flex items-center justify-center gap-1 mb-4">
                  <input name="cgpa" value={editData.cgpa} onChange={handleEditChange} className="w-16 px-2 py-1 border rounded-lg text-center font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="CGPA" />
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">CGPA</span>
            </div>
              </>
            )}
              </div>
          {/* Right: Details & Tabs */}
          <div className="flex-1 p-6 md:p-10">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6 items-center justify-between">
              <div>
                <button
                  className={`pb-2 text-base font-medium transition border-b-2 ${activeTab === 'about' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
                  onClick={() => setActiveTab('about')}
                >
                  About
                </button>
              </div>
              {activeTab === 'about' && !isEditing && (
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow hover:bg-blue-700 transition"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            {/* About Tab */}
            {activeTab === 'about' && !isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                  <div className="flex items-center text-gray-700 mb-2"><FaEnvelope className="mr-2" /> {user.email}</div>
                  <div className="flex items-center text-gray-700 mb-2"><FaPhone className="mr-2" /> {user.phone}</div>
                  <div className="flex items-center text-gray-700 mb-2"><FaUserGraduate className="mr-2" /> {user.roll}</div>
            </div>
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                  <div className="flex items-center text-gray-700 mb-2"><FaBirthdayCake className="mr-2" /> {user.birthday}</div>
                  <div className="flex items-center text-gray-700 mb-2"><span className="mr-2">Gender:</span> {user.gender}</div>
                  <div className="flex items-center text-gray-700 mb-2"><span className="mr-2">Branch:</span> {user.branch}</div>
                  <div className="flex items-center text-gray-700 mb-2"><span className="mr-2">Year:</span> {user.year}</div>
        </div>
            </div>
          )}
            {/* Edit Mode */}
            {activeTab === 'about' && isEditing && (
              <form onSubmit={handleEditSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Email</label>
                    <input name="email" value={editData.email} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Phone</label>
                    <input name="phone" value={editData.phone} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Roll Number</label>
                    <input name="roll" value={editData.roll} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Location</label>
                    <input name="location" value={editData.location} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Role</label>
                    <input name="role" value={editData.role} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">CGPA</label>
                    <input name="cgpa" value={editData.cgpa} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
            </div>
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Name</label>
                    <input name="name" value={editData.name} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Birthday</label>
                    <input name="birthday" value={editData.birthday} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Gender</label>
                    <input name="gender" value={editData.gender} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Branch</label>
                    <input name="branch" value={editData.branch} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Year</label>
                    <input name="year" value={editData.year} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm mb-1">Skills</label>
                <input 
                      name="skills"
                      value={Array.isArray(editData.skills) ? editData.skills.join(', ') : editData.skills}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="e.g. C++, React, DSA"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Save</button>
                    <button type="button" onClick={handleEditCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition">Cancel</button>
              </div>
            </div>
              </form>
            )}
            {/* Skills Section Only */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? user.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                  )) : <span className="text-gray-400">No skills listed</span>}
              </div>
              ) : (
                <input 
                  name="skills"
                  value={Array.isArray(editData.skills) ? editData.skills.join(', ') : editData.skills}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g. C++, React, DSA"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 