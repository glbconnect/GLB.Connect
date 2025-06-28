import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout; 