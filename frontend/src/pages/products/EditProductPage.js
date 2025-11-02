import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery, useUpdateProductMutation } from 'services/productsApiSlice';
import { useGetProfileQuery } from 'services/authApiSlice';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import FormGroup from 'components/ui/FormGroup';
import Textarea from 'components/ui/Textarea';
import Select from 'components/ui/Select';
import { useGetCategoriesQuery } from 'services/categoriesApiSlice';

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: existingProductData, isLoading, isSuccess, isError, error } = useGetProductByIdQuery(id);
  const existingProduct = existingProductData?.data;
  const [updateProduct] = useUpdateProductMutation();
  const { data: userData, isLoading: isLoadingUser } = useGetProfileQuery();
  const user = userData?.data;
  
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    title: '',
    stock: 0,
    price: 0,
    category_id: '', // Changed to category_id
    description: '',
    brand: '',
    image: '',
  });

  useEffect(() => {
    if (isSuccess && existingProduct) {
      setFormData({
        title: existingProduct.title || '',
        stock: existingProduct.stock || 0,
        price: existingProduct.price || 0,
        category_id: existingProduct.category?.id || '', // Use category ID
        description: existingProduct.description || '',
        brand: existingProduct.brand || '',
        image: existingProduct.image || '',
      });
    } else if (isError) {
      console.error('Failed to load product for editing:', error);
      navigate('/products'); // Redirect if product not found or error
    }
  }, [existingProduct, isSuccess, isError, error, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!user || !user.id) {
        console.error('User not authenticated or user ID not found.');
        // Optionally redirect to login
        return;
      }

      const updatedProductData = {
        user_id: user.id,
        title: formData.title,
        stock: Number(formData.stock),
        price: Number(formData.price),
        category_id: formData.category_id, // Send category_id
        description: formData.description,
        brand: formData.brand,
        image: formData.image,
      };

      

      await updateProduct({ id, updatedProduct: updatedProductData }).unwrap();
      navigate('/products');
    } catch (err) {
      console.error('Failed to update product:', err);
      // TODO: Display error message to user
    }
  };

  if (isLoading) return <div>Loading product for editing...</div>;
  if (isError) return <div>Error loading product.</div>;
  if (!existingProduct) return <div>Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-text mb-6">Edit Product: {formData.title}</h2>
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup label="Title" htmlFor="title">
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
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
            value={formData.stock}
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
            value={formData.price}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Category" htmlFor="category_id">
          <Select
            id="category_id"
            name="category_id"
            value={formData.category_id}
  onChange={(value) => setFormData({ ...formData, category_id: value })}
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            required
          />
        </FormGroup>

        <FormGroup label="Brand" htmlFor="brand">
          <Input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Image" htmlFor="image" className="md:col-span-2">
          <Input
            type="file"
            id="image"
            onChange={handleImageUpload}
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-md shadow-sm"
            />
          )}
        </FormGroup>

        <FormGroup label="Description" htmlFor="description" className="md:col-span-2">
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;