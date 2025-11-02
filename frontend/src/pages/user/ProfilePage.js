import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetProfileQuery, useUpdateProfileMutation } from 'services/authApiSlice';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import Alert from 'components/ui/Alert';
import FormGroup from 'components/ui/FormGroup';
import { selectToken } from 'store/authSlice';

const ProfilePage = () => {
   const token = useSelector(selectToken);
const { data, } = useGetProfileQuery(undefined, { skip: !token });


  const user =data?.data 
   const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updateProfile, { isLoading, isSuccess, isError, error }] =
    useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name, email });
  };

  return (
    <div className=" bg-grad flex items-center justify-center px-4 py-5">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-4xl font-semibold mb-3">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {user?.name || 'Your Profile'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Alerts */}
        {isSuccess && (
          <Alert
            type="success"
            message="Profile updated successfully."
            className="mb-4"
          />
        )}
        {isError && (
          <Alert
            type="error"
            message={error?.data?.message || 'An error occurred.'}
            className="mb-4"
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup  label="Full Name">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </FormGroup>
          <FormGroup  label="Email Address">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </FormGroup>
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full "
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
