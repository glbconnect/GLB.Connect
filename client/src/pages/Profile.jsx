import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { updateProfile, changePassword } from '../services/api';

const Profile = ({ isLoggedIn, onLogout, currentUser, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Test User',
    email: currentUser?.email || 'test@example.com'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Redirect to login if not logged in
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear success message when form changes
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear success message when form changes
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsLoading(true);
    try {
      const response = await updateProfile(formData);
      
      if (response.success) {
        setUpdateSuccess(true);
        // Update the current user in the parent component
        onUpdateProfile && onUpdateProfile(response.user);
      } else {
        setErrors({
          form: response.error || 'Failed to update profile'
        });
      }
    } catch (error) {
      setErrors({
        form: error.error || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsPasswordLoading(true);
    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setPasswordSuccess(true);
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordErrors({
          form: response.error || 'Failed to change password'
        });
      }
    } catch (error) {
      setPasswordErrors({
        form: error.error || 'Failed to change password. Please try again.'
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Profile</h1>
          
          {updateSuccess && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
              Profile updated successfully!
            </div>
          )}
          
          {errors.form && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="mb-4 md:mb-0 md:w-1/2">
                <Input
                  type="text"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  error={errors.name}
                  fullWidth
                />
              </div>
              <div className="md:w-1/2">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  error={errors.email}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Change Password</h2>
          
          {passwordSuccess && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
              Password changed successfully!
            </div>
          )}
          
          {passwordErrors.form && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {passwordErrors.form}
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="mb-4">
              <Input
                type="password"
                name="currentPassword"
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                error={passwordErrors.currentPassword}
                fullWidth
              />
            </div>
            
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="mb-4 md:mb-0 md:w-1/2">
                <Input
                  type="password"
                  name="newPassword"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  error={passwordErrors.newPassword}
                  fullWidth
                />
              </div>
              <div className="md:w-1/2">
                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  error={passwordErrors.confirmPassword}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                loading={isPasswordLoading}
                disabled={isPasswordLoading}
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Messaging Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Anonymous Messages</h3>
                <p className="text-sm text-gray-600">Allow receiving messages from anonymous users.</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input 
                  type="checkbox" 
                  id="allow-anonymous" 
                  className="sr-only"
                  defaultChecked={true}
                />
                <label 
                  htmlFor="allow-anonymous" 
                  className="block h-6 w-12 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-1 before:left-1 before:transition-transform before:duration-200 checkbox-toggle"
                >
                  <span className="sr-only">Allow anonymous messages</span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive email notifications for new messages.</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input 
                  type="checkbox" 
                  id="email-notifications" 
                  className="sr-only"
                  defaultChecked={true}
                />
                <label 
                  htmlFor="email-notifications" 
                  className="block h-6 w-12 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-1 before:left-1 before:transition-transform before:duration-200 checkbox-toggle"
                >
                  <span className="sr-only">Email notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            variant="outline" 
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={onLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 