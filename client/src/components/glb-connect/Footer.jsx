import React from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Logo and Mission */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              GLB.Connect
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Guiding students for a collaborative, growth-oriented college experience.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors">Feedback</a></li>
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="w-5 h-5" />
                <a href="mailto:contact@glbconnect.com" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  glb.connect@gmail.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400">
                <PhoneIcon className="w-5 h-5" />
                <a href="tel:+1234567890" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  +91-8933805699
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400">
                <MapPinIcon className="w-5 h-5" />
                <span>GL Bajaj Institute, Greater Noida</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} GLB.Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
