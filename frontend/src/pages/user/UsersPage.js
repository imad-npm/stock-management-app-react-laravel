import React, { useState } from 'react';
import { useGetUsersQuery } from 'services/usersApiSlice';
import SearchUser from 'components/user/SearchUser';
import Pagination from 'components/ui/Pagination';
import Button from 'components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import UserList from 'components/user/UserList';
import { useUserFilters } from 'hooks/useUserFilters';

function UsersPage() {
    const [page, setPage] = useState(1);
    const { filters, setFilter, resetFilters, queryString, search, setSearch } = useUserFilters();

    const { data: usersData, isLoading, isError, error } = useGetUsersQuery({ page, queryString });
    const users = usersData?.data ?? [];

    const navigate = useNavigate();

    if (isLoading) return <div>Loading users...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const currentPage = usersData?.meta.current_page || 1;
    const totalPages = usersData?.meta.last_page || 1;

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4'>
                <div className="flex flex-grow gap-4 items-center"> {/* Group Search and Filter dropdown */}
                    <SearchUser searchKey={search} setSearchKey={setSearch} />
                </div>
                <div className="flex gap-4">
                    <Button variant="success" onClick={() => navigate('/users/add')}  >
                        Add User  <PlusIcon className="h-5 w-5 ml-1" />
                    </Button>
                </div>
            </div>

            <UserList users={users} />

            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setPage} />
        </div>
    );
}

export default UsersPage;
