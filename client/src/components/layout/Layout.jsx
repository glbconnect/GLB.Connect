import React from 'react';
import Header from './Header';

const Layout = ({ children, isLoggedIn, onLogout }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} GLB.Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 