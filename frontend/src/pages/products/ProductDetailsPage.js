import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery, useDeleteProductMutation } from 'services/productsApiSlice';
import Button from 'components/ui/Button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useGetProfileQuery } from 'services/authApiSlice';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading, isSuccess, isError, error } = useGetProductByIdQuery(id);
  const product = productData?.data;
  const [deleteProduct] = useDeleteProductMutation();
  const { data: user } = useGetProfileQuery();

  if (isLoading) return <div>Loading product details...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg mt-6 text-red-600">
        Product not found!
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${product.title}?`)) {
      try {
        await deleteProduct(product.id).unwrap();
        navigate('/products');
      } catch (err) {
        console.error('Failed to delete product:', err);
        // TODO: Display error message to user
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="md:col-span-1">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full max-h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{product.title}</h2>
              <p className="text-gray-500 text-sm mb-4">{product.brand}</p>
              
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 text-base">{product.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Category</h3>
                  <p className="text-gray-600">{product.category.name}</p>
                </div>
                {user?.data.role === 'admin' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Created By</h3>
                    <p className="text-gray-600">{product.user.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="primary" onClick={() => navigate(`/products/edit/${product.id}`)}>
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

export default ProductDetailsPage;