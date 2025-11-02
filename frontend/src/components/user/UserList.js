import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteUserMutation } from 'services/usersApiSlice';
import Table from 'components/ui/Table';
import Button from 'components/ui/Button';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

function UserList({users}) {


       const [deleteUser] = useDeleteUserMutation();
        const navigate = useNavigate();
        
        const columns = [
        { header: '#', accessor: 'id' },
        { header: 'Name', accessor: 'name', truncate: true },
        { header: 'Email', accessor: 'email', truncate: true },
        { header: 'Role', accessor: 'role' },
        {
            header: 'Action', accessor: 'action', Cell: (row) => (
                <div className='flex space-x-2'>
                    <Button size="sm" variant="primary" onClick={() => navigate(`/users/${row.id}`)}> 
                        <EyeIcon className="h-5 w-5" />
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => navigate(`/users/edit/${row.id}`)}>
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
      if (window.confirm('Are you sure you want to delete this user?')) {
        try {
          await deleteUser(id).unwrap();
        } catch (err) {
          console.error('Failed to delete user:', err);
          // TODO: Display error message to user
        }
      }
    };

  return (
    <div>

              <Table
                data={users}
                columns={columns}
            />


    </div>
  )
}

export default UserList