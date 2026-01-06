import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import HeroSection from '../components/glb-connect/HeroSection';
import Features from '../components/glb-connect/Features';
import ExperiencedPeers from '../components/glb-connect/ExperiencedPeers';
import Testimonials from '../components/glb-connect/Testimonials';
import UpcomingFeatures from '../components/glb-connect/UpcomingFeatures';
import FeedbackSection from '../components/glb-connect/FeedbackSection';
import Footer from '../components/glb-connect/Footer';

const colleges = [
  'GL Bajaj Institute of Technology and Management'
];

const Home = ({ isLoggedIn, onLogout }) => {
  const [isDark, setIsDark] = useState(false);

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className={isDark ? 'dark' : ''}>
        <button
          onClick={() => setIsDark((v) => !v)}
          className="fixed bottom-4 right-4 z-50 bg-white text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 3.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 12 3.25ZM6.5 5.5a.75.75 0 0 1 1.06 0l1.414 1.414a.75.75 0 1 1-1.06 1.06L6.5 6.56A.75.75 0 0 1 6.5 5.5ZM3.25 12a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 3.25 12Zm13.536-4.536a.75.75 0 0 1 0 1.06L15.372 9.94a.75.75 0 1 1-1.06-1.06l1.414-1.414a.75.75 0 0 1 1.06 0ZM18.25 11.25h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5ZM8.81 14.06a.75.75 0 0 1 1.06 0l1.414 1.414a.75.75 0 1 1-1.06 1.06L8.81 15.12a.75.75 0 0 1 0-1.06ZM12 18.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm5.69-3.19a.75.75 0 0 1 0 1.06l-1.414 1.414a.75.75 0 1 1-1.06-1.06l1.414-1.414a.75.75 0 0 1 1.06 0ZM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .832.167 8.25 8.25 0 0 1 2.341 5.742 8.25 8.25 0 0 1-8.25 8.25 8.25 8.25 0 0 1-3.167-.635.75.75 0 0 1-.167-1.292 10.5 10.5 0 0 0 8.411-12.232A.75.75 0 0 1 9.528 1.718ZM15.75 6a.75.75 0 0 1 .75-.75h.375a.75.75 0 0 1 0 1.5H16.5A.75.75 0 0 1 15.75 6Zm3.03 3.97a.75.75 0 0 1 1.06 0l.265.265a.75.75 0 0 1-1.06 1.06l-.265-.265a.75.75 0 0 1 0-1.06ZM21.75 12a.75.75 0 0 1 .75-.75h.375a.75.75 0 0 1 0 1.5H22.5a.75.75 0 0 1-.75-.75Zm-2.47 5.03a.75.75 0 0 1 0 1.06l-.265.265a.75.75 0 0 1-1.06-1.06l.265-.265a.75.75 0 0 1 1.06 0ZM16.5 21.75a.75.75 0 0 1 .75-.75h.375a.75.75 0 0 1 0 1.5H17.25a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <div className="bg-white dark:bg-gray-900 overflow-x-hidden px-2 sm:px-4 md:px-8">
        <HeroSection isLoggedIn={isLoggedIn} />
        
        <div className="py-6 md:py-8 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          <div className="scroller">
            <div className="scroller-inner">
              {[...colleges, ...colleges].map((college, index) => (
                <span key={index}>{college}</span>
              ))}
            </div>
          </div>
        </div>
        
        <Features />
        <ExperiencedPeers />
        <Testimonials />
        <UpcomingFeatures />
        <FeedbackSection />
        <Footer />
        </div>
      </div>
    </Layout>
  );
};

export default Home; 
