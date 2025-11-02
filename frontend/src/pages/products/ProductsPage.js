import React, { useEffect, useState } from 'react';
import { useGetProductsQuery } from 'services/productsApiSlice';
import SearchProduct from 'components/products/SearchProduct.js';
import Pagination from 'components/ui/Pagination.js';
import FilterProduct from 'components/products/FilterProduct.js';
import Button from 'components/ui/Button.js';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Dropdown from 'components/ui/Dropdown.js';
import { useNavigate } from 'react-router-dom';
import ProductList from 'components/products/ProductList.js';
import { useProductFilters } from 'hooks/useProductFilters';

function ProductsPage() {
    const [page, setPage] = useState(1);
  
    const { filters, setFilter, resetFilters, queryString, search, setSearch } = useProductFilters();
console.log(queryString);

  const { data: productsData, isLoading, isError, error } = useGetProductsQuery({page, queryString});
    const products = productsData?.data ?? [];

    const navigate = useNavigate();
  useEffect(() => {
  setPage(1);
}, [queryString]);

    if (isLoading) return <div>Loading products...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const currentPage = productsData?.meta.current_page || 1;
    const totalPages = productsData?.meta.last_page || 1;

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4'>
                <div className="flex flex-grow gap-4 items-center"> {/* Group Search and Filter dropdown */}
                    <SearchProduct searchKey={search} setSearchKey={setSearch} />
                    <Dropdown.Root>
                        <Dropdown.Trigger as={Button}>
                                <FunnelIcon className="h-5 w-5 " /> Filter
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <FilterProduct filters={filters} setFilter={setFilter} reset={resetFilters} />
                        </Dropdown.Content>
                    </Dropdown.Root>
                </div>
                <Button variant="success" onClick={() => navigate('/products/add')}>
                    Add Product <PlusIcon className="h-5 w-5 ml-1" />
                </Button>
            </div>

            <ProductList products={products} />

            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setPage} />
        </div>
    );
}

export default ProductsPage;
