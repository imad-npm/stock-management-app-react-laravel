import React, { useState } from 'react';
import { useCreateProductMutation } from 'services/productsApiSlice';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import FormGroup from 'components/ui/FormGroup';
import Textarea from 'components/ui/Textarea';
import { useNavigate } from 'react-router-dom';

function AddProductPage() {
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();

  const [form, setForm] = useState({
    title: '',
    stock: 0,
    price: 0,
    category: '',
    description: '',
    brand: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result })); // Store base64 or URL
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        console.error('User not authenticated or user ID not found.');
        // Optionally redirect to login
        return;
      }

      const newProduct = {
        user_id: user.id,
        title: form.title,
        stock: Number(form.stock),
        price: Number(form.price),
        category: form.category,
        description: form.description,
        brand: form.brand,
        image: form.image,
      };

      await createProduct(newProduct).unwrap();
      navigate('/products');
    } catch (err) {
      console.error('Failed to create product:', err);
      // TODO: Display error message to user
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-text mb-6">Add New Product</h2>
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup label="Title" htmlFor="title">
          <Input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Stock" htmlFor="stock">
          <Input
            type="number"
            id="stock"
            name="stock"
            min={0}
            value={form.stock}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Price" htmlFor="price">
          <Input
            type="number"
            step="0.01"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Category" htmlFor="category">
          <Input
            type="text"
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Brand" htmlFor="brand">
          <Input
            type="text"
            id="brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Image" htmlFor="image" className="md:col-span-2">
          <Input
            type="file"
            id="image"
            onChange={handleImageUpload}
          />
          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-md shadow-sm"
            />
          )}
        </FormGroup>

        <FormGroup label="Description" htmlFor="description" className="md:col-span-2">
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </FormGroup>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" variant="primary">Save Product</Button>
        </div>
      </form>
    </div>
  );
}

export default AddProductPage;