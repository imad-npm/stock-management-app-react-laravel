import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteProductMutation } from 'services/productsApiSlice';
import Table from 'components/ui/Table';
import Button from 'components/ui/Button';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useGetProfileQuery } from 'services/authApiSlice';

function ProductList({products}) {
    const { data: user } = useGetProfileQuery();

       const [deleteProduct] = useDeleteProductMutation();
        const navigate = useNavigate();
        
        const columns = [
        { header: '#', accessor: 'id' },
        {
            header: 'Image', accessor: 'image', Cell: (row) => (
                <img src={row.image} alt={row.title} width="50" />
            )
        },
        { header: 'Name', accessor: 'title', truncate: true },
        { header: 'Stock', accessor: 'stock' },
        { header: 'Price', accessor: 'price' },
        { header: 'Category', accessor: 'category.name', truncate: true },
    ];

    if (user?.data.role === 'admin') {
        columns.push({ header: 'User', accessor: 'user.name', truncate: true });
    }

    columns.push({
        header: 'Action', accessor: 'action', Cell: (row) => (
            <div className='flex space-x-2'>
                <Button size="sm" variant="primary" onClick={() => navigate(`/products/${row.id}`)}> 
                    <EyeIcon className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="primary" onClick={() => navigate(`/products/edit/${row.id}`)}>
                  <PencilSquareIcon className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
                    <TrashIcon className="h-5 w-5" />
                </Button>
            </div>
        )
    });

        const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          await deleteProduct(id).unwrap();
        } catch (err) {
          console.error('Failed to delete product:', err);
          // TODO: Display error message to user
        }
      }
    };

  return (
    <div>

              <Table
                data={products}
                columns={columns}
            />


    </div>
  )
}

export default ProductList