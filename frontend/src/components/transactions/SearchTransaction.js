import React from 'react';
import Input from 'components/ui/Input';

function SearchTransaction({ searchKey, setSearchKey }) {
    return (
        <div className='flex-grow'>
            <Input 
                type="search" 
                placeholder="Search by product..." 
                aria-label="Search" 
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)} 
            />
        </div>
    );
}

export default SearchTransaction;