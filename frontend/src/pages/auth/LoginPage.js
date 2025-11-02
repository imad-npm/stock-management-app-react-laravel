import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from 'services/authApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'store/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch =useDispatch() ;
     const token = useSelector(selectToken);
  
  console.log(!token);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   const {user}= await login({ email, password }).unwrap();
        
      navigate('/dashboard'); // Redirect to dashboard or a protected route
    } catch (err) {
      console.error('Failed to login:', err);
      // TODO: Display error message to user
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
