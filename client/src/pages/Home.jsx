import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

// Import copied GLB-Connect components
import HeroSection from '../components/glb-connect/HeroSection';
import Features from '../components/glb-connect/Features';
import ExperiencedPeers from '../components/glb-connect/ExperiencedPeers';
import Testimonials from '../components/glb-connect/Testimonials';
import FeedbackSection from '../components/glb-connect/FeedbackSection';

const Home = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="overflow-x-hidden">
        <HeroSection />
        
        {/* Login/Registration buttons overlay if not logged in */}
        {!isLoggedIn && (
          <div className="bg-white py-8">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Join GLB.Connect Today</h2>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Messages access if logged in */}
        {isLoggedIn && (
          <div className="bg-white py-8">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Your Messages</h2>
              <Button 
                size="lg" 
                onClick={() => navigate('/messages')}
              >
                Go to Messages
              </Button>
            </div>
          </div>
        )}
        
        <Features />
        <ExperiencedPeers />
        <Testimonials />
        <FeedbackSection />
      </div>
    </Layout>
  );
};

export default Home; 