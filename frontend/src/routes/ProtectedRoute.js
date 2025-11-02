import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetProfileQuery } from 'services/authApiSlice';
import { useSelector } from 'react-redux';
import { selectToken } from 'store/authSlice';

const ProtectedRoute = ({roles }) => {
    const token = useSelector(selectToken);
  const { data: profile, isLoading, isSuccess } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const user = profile?.data;
  
  

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
