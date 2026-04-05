import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* የልጅ ገጾች እዚህ ይተካሉ */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;