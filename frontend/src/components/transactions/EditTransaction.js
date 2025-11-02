import React, { useState } from 'react';
import { useUpdateTransactionMutation } from 'services/transactionsApiSlice';
import { useGetProductsQuery } from 'services/productsApiSlice';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Button from 'components/ui/Button';
import FormGroup from 'components/ui/FormGroup';

function EditTransaction({ transaction }) {
  const [updateTransaction] = useUpdateTransactionMutation();
  const { data: productsData } = useGetProductsQuery();
  const products = productsData?.data ?? [];

  const [form, setForm] = useState({ ...transaction });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      await updateTransaction({ id: transaction.id, updatedTransaction: form }).unwrap();
      // Optionally, add some success feedback or close the modal
    } catch (err) {
      console.error('Failed to update transaction:', err);
      // TODO: Display error message to user
    }
  }

  const productOptions = products.map(p => ({ value: p.title, label: p.title }));
  const typeOptions = [{ value: 'EXIT', label: 'EXIT' }, { value: 'ENTRY', label: 'ENTRY' }];

  return (
    <div>
      <form onSubmit={handleSave}>
        <FormGroup label="Product" htmlFor="product">
          <Input
            id="product"
            name="product"
            value={form.product}
            onChange={handleChange}
            list="products"
          />
          <datalist id="products">
            {products.map((option) => (
              <option key={option.id} value={option.title} />
            ))}
          </datalist>
        </FormGroup>

        <FormGroup label="Quantity" htmlFor="quantity">
          <Input
            type="number"
            id="quantity"
            name="quantity"
            min={1}
            value={form.quantity}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Type" htmlFor="type">
          <Select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={typeOptions}
          />
        </FormGroup>

        <div className="w-full md:w-1/3 mb-4">
          <label htmlFor="date" className="block text-sm font-medium">Date</label>
          <Input
            type="text"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" variant="primary">Save</Button>
      </form>
    </div>
  );
}

export default EditTransaction;
