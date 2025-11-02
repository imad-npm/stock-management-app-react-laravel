import React from 'react';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Button from 'components/ui/Button';

function FilterTransaction({ filters, setFilter, reset }) {

    const typeOptions = [
        { value: 'ALL', label: 'ALL' },
        { value: 'EXIT', label: 'EXIT' },
        { value: 'ENTRY', label: 'ENTRY' }
    ];

    return (
        <div className="p-4 w-44"> {/* Inner padding for the dropdown content */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4"> {/* Adjusted grid for dropdown content */}
                <div>
                    <label htmlFor="from_date" className="block text-sm font-medium text-text mb-1">From Date</label>
                    <Input type="date" value={filters.from_date} onChange={(e) => setFilter('from_date', e.target.value)} id="from_date" />
                </div>
                <div>
                    <label htmlFor="to_date" className="block text-sm font-medium text-text mb-1">To Date</label>
                    <Input type="date" value={filters.to_date} onChange={(e) => setFilter('to_date', e.target.value)} id="to_date" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-text mb-1">Type</label>
<Select
  id="type"
  variant='small'
  value={filters.type}
  onChange={(value) => setFilter('type', value)}
  options={typeOptions}
/>
                </div>
                <Button onClick={reset} variant="secondary" >Reset</Button>
            </div>
        </div>
    );
}

export default FilterTransaction;