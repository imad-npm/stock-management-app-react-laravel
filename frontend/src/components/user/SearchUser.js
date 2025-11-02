import React from 'react';
import Input from 'components/ui/Input';

function SearchUser({ searchKey, setSearchKey }) {
  return (
    <div className="flex-grow">
      <Input
        type="search"
        placeholder="Search by name or email..."
        aria-label="Search"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
    </div>
  );
}

export default SearchUser;
