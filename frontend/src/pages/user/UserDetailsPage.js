import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery, useDeleteUserMutation } from 'services/usersApiSlice';
import Button from 'components/ui/Button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userData, isLoading, isSuccess, isError, error } = useGetUserByIdQuery(id);
  const user = userData?.data;
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) return <div>Loading user details...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg mt-6 text-red-600">
        User not found!
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteUser(user.id).unwrap();
        navigate('/users');
      } catch (err) {
        console.error('Failed to delete user:', err);
        // TODO: Display error message to user
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Placeholder for image or avatar */}
          <div className="md:col-span-1 flex justify-center items-center bg-gray-100 rounded-lg shadow-lg p-4">
            <svg className="h-32 w-32 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Role</h3>
                  <p className="text-gray-600 text-base">{user.role}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="warning" onClick={() => navigate(`/users/edit/${user.id}`)}>
                <PencilSquareIcon className="h-5 w-5 mr-2" /> Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <TrashIcon className="h-5 w-5 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;
