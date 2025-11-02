import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTransactionByIdQuery, useUpdateTransactionMutation } from 'services/transactionsApiSlice';
import { useGetProductsQuery } from 'services/productsApiSlice';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import SearchableSelect from 'components/ui/SearchableSelect';
import Button from 'components/ui/Button';
import FormGroup from 'components/ui/FormGroup';
import useAuth from 'hooks/useAuth';

function EditTransactionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: existingTransactionData, isLoading: transactionLoading, isError: transactionError } = useGetTransactionByIdQuery(id);

  const existingTransaction = existingTransactionData?.data;
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useGetProductsQuery();
  const products = productsData?.data ?? [];
  const [updateTransaction] = useUpdateTransactionMutation();
  const { user } = useAuth();

  const [form, setForm] = useState({
    product_id: '',
    quantity: 0,
    type: 'EXIT',
    date: '',
    notes: '',
  });

  useEffect(() => {
    if (existingTransactionData) {
      const existingTransaction = existingTransactionData.data;
      setForm({
        product_id: existingTransaction.product.id,
        quantity: existingTransaction.quantity,
        type: existingTransaction.type,
        date: new Date(existingTransaction.date).toISOString().slice(0, 16),
        notes: existingTransaction.notes || '',
      });
    } else if (transactionError) {
      console.error('Failed to load transaction for editing:', transactionError);
      navigate('/transactions');
    }
  }, [existingTransactionData, transactionError, navigate]);


  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (!user || !user.id) {
        console.error('User not authenticated or user ID not found.');
        return;
      }

      const updatedTransactionData = {
        product_id: parseInt(form.product_id),
        user_id: user.id,
        quantity: Number(form.quantity),
        type: form.type,
        date: new Date(form.date).toISOString(),
        notes: form.notes,
      };

      await updateTransaction({ id, updatedTransaction: updatedTransactionData }).unwrap();
      navigate('/transactions');
    } catch (err) {
      console.error('Failed to update transaction:', err);
      // TODO: Display error message to user
    }
  }

  const productOptions = productsLoading ? [] : products.map(p => ({ value: p.id, label: p.title }));
  const typeOptions = [{ value: 'ENTRY', label: 'ENTRY' }, { value: 'EXIT', label: 'EXIT' }];

  if (transactionLoading || productsLoading) return <div>Loading transaction for editing...</div>;
  if (transactionError) return <div>Error loading transaction.</div>;
  if (productsError) return <div>Error loading products.</div>;
  if (!existingTransaction) return <div>Transaction not found.</div>;
  console.log(existingTransaction);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-text mb-6">Edit Transaction: {existingTransaction.product.title}</h2>
      <form onSubmit={handleSave}>
        <FormGroup label="Product" htmlFor="product_id">
          <SearchableSelect
            id="product_id"
            name="product_id"
            value={form.product_id}
            onChange={(value) => handleChange({ target: { name: 'product_id', value } })}
            options={productOptions}
            placeholder="Select a product"
            required
          />
        </FormGroup>

        <FormGroup label="Quantity" htmlFor="quantity">
          <Input
            type="number"
            id="quantity"
            name="quantity"
            min={1}
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Type" htmlFor="type">
          <Select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={typeOptions}
            required
          />
        </FormGroup>

        <FormGroup label="Date" htmlFor="date">
          <Input
            type="datetime-local"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Notes" htmlFor="notes">
          <Input
            type="text"
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </FormGroup>

        <Button type="submit" variant="primary">Save Changes</Button>
      </form>
    </div>
  );
}

export default EditTransactionPage;