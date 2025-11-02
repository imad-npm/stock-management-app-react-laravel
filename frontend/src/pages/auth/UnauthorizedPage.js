import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
        <p className="text-lg text-gray-700 mb-6">You do not have permission to access this page.</p>
        <Link to="/dashboard" className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-900 transition duration-300">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
