import React, { useMemo } from 'react';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Button from 'components/ui/Button';

export default function FilterProduct({ filters, setFilter, resetFilters, products = [] }) {
  // build categories dynamically if backend provides them
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    return [{ value: '', label: 'All' }, ...categories.map(cat => ({ value: cat, label: cat }))];
  }, [products]);

  return (
    <div className="p-4 space-y-4 w-64">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stock filters */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="minStock">Min Stock</label>
          <Input
            type="number"
            id="minStock"
            value={filters.minStock}
            onChange={e => setFilter('minStock', e.target.value)}
            placeholder="e.g. 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="maxStock">Max Stock</label>
          <Input
            type="number"
            id="maxStock"
            value={filters.maxStock}
            onChange={e => setFilter('maxStock', e.target.value)}
            placeholder="e.g. 100"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
          <Select
            id="category"
            name="category"
            value={filters.category}
            onChange={e => setFilter('category', e.target.value)}
            options={categoryOptions}
          />
        </div>

        {/* Price filters */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="minPrice">Min Price</label>
          <Input
            type="number"
            id="minPrice"
            value={filters.minPrice}
            onChange={e => setFilter('minPrice', e.target.value)}
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="maxPrice">Max Price</label>
          <Input
            type="number"
            id="maxPrice"
            value={filters.maxPrice}
            onChange={e => setFilter('maxPrice', e.target.value)}
            placeholder="e.g. 500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={resetFilters}>Reset</Button>
      </div>
    </div>
  );
}
