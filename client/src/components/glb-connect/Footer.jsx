import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white py-16 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 text-blue-600">GLB.Connect</h3>
              <p className="text-gray-600 text-sm">
                Connecting juniors and seniors for a collaborative, growth-oriented college experience
              </p>
            </div>
            <div className="mb-4">
              <p className="font-semibold mb-2">Follow Us</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.05 22v-7.87h2.65l.37-3.08h-3.02v-1.97c0-.89.25-1.5 1.54-1.5h1.65v-2.7c-.28-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.46-4.01 4.13v2.16h-2.69v3.08h2.69V22h3.93z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c2.73 0 3.05.01 4.12.06 1 .05 1.54.21 1.9.35.48.19.82.42 1.18.78.36.36.59.7.78 1.18.14.36.3.9.35 1.9.05 1.06.06 1.39.06 4.12s-.01 3.05-.06 4.12c-.05 1-.21 1.54-.35 1.9-.19.48-.42.82-.78 1.18-.36.36-.7.59-1.18.78-.36.14-.9.3-1.9.35-1.07.05-1.39.06-4.12.06s-3.05-.01-4.12-.06c-1-.05-1.54-.21-1.9-.35-.48-.19-.82-.42-1.18-.78-.36-.36-.59-.7-.78-1.18-.14-.36-.3-.9-.35-1.9C2.01 15.05 2 14.73 2 12s.01-3.05.06-4.12c.05-1 .21-1.54.35-1.9.19-.48.42-.82.78-1.18.36-.36.7-.59 1.18-.78.36-.14.9-.3 1.9-.35C8.95 2.01 9.27 2 12 2zm0 2c-2.69 0-3.02.01-4.07.06-.98.04-1.37.2-1.69.34-.42.16-.72.4-1.04.71-.31.31-.55.62-.71 1.04-.14.32-.3.71-.34 1.69-.05 1.05-.06 1.37-.06 4.07s.01 3.02.06 4.07c.04.98.2 1.37.34 1.69.16.42.4.72.71 1.04.31.31.62.55 1.04.71.32.14.71.3 1.69.34 1.05.05 1.37.06 4.07.06s3.02-.01 4.07-.06c.98-.04 1.37-.2 1.69-.34.42-.16.72-.4 1.04-.71.31-.31.55-.62.71-1.04.14-.32.3-.71.34-1.69.05-1.05.06-1.37.06-4.07s-.01-3.02-.06-4.07c-.04-.98-.2-1.37-.34-1.69-.16-.42-.4-.72-.71-1.04-.31-.31-.62-.55-1.04-.71-.32-.14-.71-.3-1.69-.34-1.05-.05-1.37-.06-4.07-.06z" />
                    <path d="M12 14.98c-1.65 0-2.98-1.33-2.98-2.98s1.33-2.98 2.98-2.98 2.98 1.33 2.98 2.98-1.33 2.98-2.98 2.98zm0-7.56c-2.53 0-4.58 2.05-4.58 4.58s2.05 4.58 4.58 4.58 4.58-2.05 4.58-4.58-2.05-4.58-4.58-4.58z" />
                    <circle cx="16.85" cy="7.15" r="1.07" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3.01s-2.18 1.01-3.28 1.2c-.9-.93-2.2-1.5-3.64-1.5-2.76 0-5 2.24-5 5 0 .4.05.78.14 1.15-4.16-.21-7.84-2.2-10.3-5.2-.44.76-.68 1.62-.68 2.55 0 1.74.89 3.27 2.24 4.17-.83-.03-1.6-.25-2.28-.62v.06c0 2.43 1.73 4.45 4.03 4.9-.42.12-.86.18-1.32.18-.32 0-.64-.03-.95-.09.64 1.99 2.49 3.44 4.68 3.48-1.72 1.35-3.87 2.15-6.22 2.15-.4 0-.8-.03-1.19-.07 2.22 1.42 4.85 2.25 7.68 2.25 9.21 0 14.25-7.63 14.25-14.25 0-.22 0-.43-.02-.65.98-.7 1.83-1.58 2.51-2.58l-.05-.02z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
              <li><Link to="/team" className="text-gray-600 hover:text-blue-600">Our Team</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact Us</Link></li>
            </ul>
          </div>

          {/* Resource */}
          <div>
            <h3 className="font-semibold mb-4">Resource</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-blue-600">Help Center</Link></li>
              <li><Link to="/guides" className="text-gray-600 hover:text-blue-600">Guides</Link></li>
              <li><Link to="/feedback" className="text-gray-600 hover:text-blue-600">Feedback</Link></li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex justify-end">
            <div>
              <h3 className="text-xl font-bold text-blue-600">GLB.Connect</h3>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          Copyright ©2024 All rights reserved | Made with ❤ by BNMK
        </div>
      </div>
    </footer>
  );
};

export default Footer;
