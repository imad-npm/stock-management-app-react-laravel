import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from 'layouts/Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Or a specific Navbar */}
      <div className=" mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
