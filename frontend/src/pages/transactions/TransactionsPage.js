import React, { useEffect, useState } from 'react';
import { useGetTransactionsQuery } from 'services/transactionsApiSlice';
import SearchTransaction from 'components/transactions/SearchTransaction';
import Pagination from 'components/ui/Pagination';
import FilterTransaction from 'components/transactions/FilterTransaction';
import Button from 'components/ui/Button';
import Dropdown from 'components/ui/Dropdown.js';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTransactionFilters } from 'hooks/useTransactionFilters';
import TransactionList from 'components/transactions/TransactionList';

export default function TransactionsPage() {
    const [page, setPage] = useState(1);
    const { filters, setFilter, resetFilters, queryString, search, setSearch } = useTransactionFilters();

    const { data: transactionsData, isLoading, isError, error } = useGetTransactionsQuery({ page, queryString });
    const transactions = transactionsData?.data ?? [];
    const navigate = useNavigate();
   useEffect(() => {
  setPage(1);
}, [queryString]);

    if (isLoading) return <div>Loading transactions...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const currentPage = transactionsData?.meta.current_page || 1;
    const totalPages = transactionsData?.meta.last_page || 1;

 
    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4'>
                <div className="flex flex-grow gap-4 items-center"> {/* Group Search and Filter dropdown */}
                    <SearchTransaction searchKey={search} setSearchKey={setSearch} />
                    <Dropdown.Root>
                        <Dropdown.Trigger as={Button}>
                            <FunnelIcon className="h-5 w-5 " /> Filter
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <FilterTransaction filters={filters} setFilter={setFilter} reset={resetFilters} />
                        </Dropdown.Content>
                    </Dropdown.Root>
                </div>
                <div className="flex gap-4">
                    <Button variant="success" onClick={() => navigate('/transactions/add')}  >
                        Add Transaction  <PlusIcon className="h-5 w-5 ml-1" />
                    </Button>
                </div>
            </div>

            <TransactionList transactions={transactions} />

            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setPage} />

        </div>
    );
}

