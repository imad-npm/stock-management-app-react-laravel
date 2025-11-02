import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteTransactionMutation } from 'services/transactionsApiSlice';
import Table from 'components/ui/Table';
import Button from 'components/ui/Button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

function TransactionList({transactions}) {


       const [deleteTransaction] = useDeleteTransactionMutation();
        const navigate = useNavigate();
        
        const columns = [
        { header: '#', accessor: 'id' },
        { header: 'Product', accessor: 'product.title', truncate: true }, // Assuming product object has a title
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Type', accessor: 'type' },
        { header: 'Date', accessor: 'date' },
        {
            header: 'Action', accessor: 'action', Cell: (row) => (
                <div className='flex space-x-2'>
                    <Button size="sm" variant="primary" onClick={() => navigate(`/transactions/edit/${row.id}`)}>
                        <PencilSquareIcon className="h-5 w-5" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
                        <TrashIcon className="h-5 w-5" />
                    </Button>
                </div>
            )
        }
    ];
        const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        try {
          await deleteTransaction(id).unwrap();
        } catch (err) {
          console.error('Failed to delete transaction:', err);
          // TODO: Display error message to user
        }
      }
    };

  return (
    <div>

              <Table
                data={transactions}
                columns={columns}
            />


    </div>
  )
}

export default TransactionList