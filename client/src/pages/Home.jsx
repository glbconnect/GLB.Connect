import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
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
    </Layout>
  );
};

export default Home; 