import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Layout from '../components/layout/Layout';
import * as api from '../services/api';

import student1 from '../assets/student1.png';
import student2 from '../assets/student2.png';
import student3 from '../assets/student3.png';

const studentImages = [student1, student2, student3];

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
    batchYear: '',
    skills: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideImages, setSlideImages] = useState([studentImages[0], studentImages[1]]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        const nextIndex = (slideIndex + 1) % studentImages.length;
        setSlideImages([
          studentImages[nextIndex],
          studentImages[(nextIndex + 1) % studentImages.length]
        ]);
        setSlideIndex(nextIndex);
        setIsSliding(false);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, [slideIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'At least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.batchYear) newErrors.batchYear = 'Batch year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      // Combine first and last name for API
      userData.name = `${formData.firstName} ${formData.lastName}`;
      // Optionally, send countryCode and phone as one field
      userData.phone = `${formData.countryCode} ${formData.phone}`;
      const authData = await api.register(userData);
      onLogin(authData);
      navigate('/');
    } catch (error) {
      setRegisterError(
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Country code options (can be expanded)
  const countryCodes = [
    { code: '+91', label: '🇮🇳 +91' },
    { code: '+1', label: '🇺🇸 +1' },
    { code: '+44', label: '🇬🇧 +44' },
    { code: '+61', label: '🇦🇺 +61' },
    { code: '+971', label: '🇦🇪 +971' },
  ];

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[540px]">
            {/* Left Side: Same as Login */}
            <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-yellow-400 to-yellow-300 p-10 relative">
              <div className="w-56 h-56 mb-6 flex items-center justify-center overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 w-full h-full flex"
                  style={{
                    transform: isSliding ? 'translateX(-100%)' : 'translateX(0)',
                    transition: isSliding ? 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' : 'none',
                  }}
                >
                  <img
                    src={slideImages[0]}
                    alt="Student Current"
                    className="w-full h-full object-contain drop-shadow-xl flex-shrink-0"
                    style={{ minWidth: '100%' }}
                  />
                  <img
                    src={slideImages[1]}
                    alt="Student Next"
                    className="w-full h-full object-contain drop-shadow-xl flex-shrink-0"
                    style={{ minWidth: '100%' }}
                  />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">GLB.Connect</h2>
                <p className="text-gray-800 text-lg font-medium mb-1">From juniors to seniors, from doubts to direction — all in one place.</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="bg-white/80 rounded-lg px-3 py-1 text-xs font-semibold text-gray-700 shadow">Q&A Threads</span>
                  <span className="bg-white/80 rounded-lg px-3 py-1 text-xs font-semibold text-gray-700 shadow">Anonymous Chats</span>
                  <span className="bg-white/80 rounded-lg px-3 py-1 text-xs font-semibold text-gray-700 shadow">Resource Sharing</span>
                </div>
              </div>
            </div>
            {/* Right Side: Registration Form */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
              <h1 className="mb-6 text-3xl font-bold text-gray-900">Sign up as student</h1>
              {registerError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {registerError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="firstName"
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      error={errors.firstName}
                      fullWidth
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="lastName"
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      error={errors.lastName}
                      fullWidth
                    />
                  </div>
                </div>
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  error={errors.email}
                  fullWidth
                />
                <Input
                  type="number"
                  name="batchYear"
                  label="Batch Year"
                  value={formData.batchYear}
                  onChange={handleChange}
                  placeholder="e.g. 2020"
                  error={errors.batchYear}
                  fullWidth
                />
                <Input
                  type="text"
                  name="skills"
                  label="Skills (comma separated)"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, Python"
                  error={errors.skills}
                  fullWidth
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      style={{ minWidth: 80 }}
                    >
                      {countryCodes.map(opt => (
                        <option key={opt.code} value={opt.code}>{opt.label}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className={`flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.phone ? 'border-red-400' : ''}`}
                    />
                  </div>
                  {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="password"
                      name="password"
                      label="Password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      error={errors.password}
                      fullWidth
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      error={errors.confirmPassword}
                      fullWidth
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                      Login
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="px-8"
                    loading={isLoading}
                    disabled={isLoading || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword || Object.keys(errors).length > 0}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register; 