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

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideImages, setSlideImages] = useState([studentImages[0], studentImages[1]]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        // After slide, update images: shift left, append next
        const nextIndex = (slideIndex + 1) % studentImages.length;
        setSlideImages([studentImages[nextIndex], studentImages[(nextIndex + 1) % studentImages.length]]);
        setSlideIndex(nextIndex);
        setIsSliding(false);
      }, 400); // match transition duration
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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const authData = await api.login(formData);
      onLogin(authData);
      navigate('/');
    } catch (error) {
      setLoginError(
        error.response?.data?.error || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden py-4 px-1 md:py-10 md:px-2">
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[540px]">
            {/* Left Side */}
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
            {/* Right Side (Login Form) */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
              <h1 className="mb-6 text-3xl font-bold text-gray-900">Log in</h1>
              {/* Social Login Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-50 transition">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>
              </div>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-4 text-gray-400 text-sm">or login with email</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>
              {loginError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {loginError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  label="Email Id"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  error={errors.email}
                  fullWidth
                />
                <Input
                  type="password"
                  name="password"
                  label="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  fullWidth
                />
                <div className="flex justify-between items-center">
                  <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">Forgot password?</Link>
                </div>
                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                  className="mt-2"
                >
                  Login
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login; 