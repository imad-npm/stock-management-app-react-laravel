
import React from 'react'
import { useSelector } from 'react-redux';
import { useGetProfileQuery } from 'services/authApiSlice';
import { selectToken } from 'store/authSlice';

function useAuth() {
   const token = useSelector(selectToken);
const { data, error, isLoading } = useGetProfileQuery(undefined, { skip: !token });


  const user =data?.data

  return {user,token}
}

export default useAuth