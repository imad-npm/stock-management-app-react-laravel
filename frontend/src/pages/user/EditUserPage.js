import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from 'services/usersApiSlice';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import FormGroup from 'components/ui/FormGroup';
import Select from 'components/ui/Select';

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: existingUserData, isLoading, isSuccess, isError, error } = useGetUserByIdQuery(id);
  const existingUser = existingUserData?.data;
  const [updateUser] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (isSuccess && existingUser) {
      setFormData({
        name: existingUser.name || '',
        email: existingUser.email || '',
        role: existingUser.role || '',
      });
    } else if (isError) {
      console.error('Failed to load user for editing:', error);
      navigate('/users'); // Redirect if user not found or error
    }
  }, [existingUser, isSuccess, isError, error, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id, updatedUser: formData }).unwrap();
      navigate('/users');
    } catch (err) {
      console.error('Failed to update user:', err);
      // TODO: Display error message to user
    }
  };

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  if (isLoading) return <div>Loading user for editing...</div>;
  if (isError) return <div>Error loading user.</div>;
  if (!existingUser) return <div>User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-text mb-6">Edit User: {formData.name}</h2>
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup label="Name" htmlFor="name">
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Email" htmlFor="email">
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Role" htmlFor="role">
          <Select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
          />
        </FormGroup>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}

export default EditUserPage;
