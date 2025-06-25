import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const HeroSection = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-blue-900 overflow-hidden">
      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-6 leading-tight">
              From <span className="text-blue-600 dark:text-blue-400">Newcomers</span> to <span className="text-purple-600 dark:text-purple-400">Navigators</span>, connecting students to succeed together.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
              A real-time platform designed to help juniors connect with seniors for personalized guidance and shared success.
            </p>
            {!isLoggedIn && (
              <div className="flex justify-center md:justify-start space-x-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/login')}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-white dark:border-white dark:hover:bg-gray-700 font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
                >
                  Log In
                </Button>
              </div>
            )}
          </motion.div>

          {/* Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="absolute w-full h-full -top-10 -right-10">
              <div className="absolute w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full opacity-50 blur-2xl bottom-0 right-0"></div>
            </div>
            <div className="relative grid grid-cols-3 gap-4">
              <motion.img 
                src="/firstperson.png" 
                alt="Student 1" 
                className="rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300"
                whileHover={{ y: -10 }}
              />
              <motion.img 
                src="/secondperson.png" 
                alt="Student 2" 
                className="rounded-full shadow-2xl mt-12 transform hover:scale-110 transition-transform duration-300"
                whileHover={{ y: -10 }}
              />
              <motion.img 
                src="/thirdperson.png" 
                alt="Student 3" 
                className="rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300"
                whileHover={{ y: -10 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
