import React, { useState } from 'react';
import { useCreateUserMutation } from 'services/usersApiSlice';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import FormGroup from 'components/ui/FormGroup';
import Select from 'components/ui/Select';
import { useNavigate } from 'react-router-dom';

function AddUserPage() {
  const navigate = useNavigate();
  const [createUser] = useCreateUserMutation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await createUser(form).unwrap();
      navigate('/users');
    } catch (err) {
      console.error('Failed to create user:', err);
      // TODO: Display error message to user
    }
  };

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-text mb-6">Add New User</h2>
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup label="Name" htmlFor="name">
          <Input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Email" htmlFor="email">
          <Input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Password" htmlFor="password">
          <Input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Confirm Password" htmlFor="password_confirmation">
          <Input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Role" htmlFor="role">
          <Select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            options={roleOptions}
          />
        </FormGroup>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" variant="primary">Save User</Button>
        </div>
      </form>
    </div>
  );
}

export default AddUserPage;
