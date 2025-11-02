import React, { useState, useEffect } from 'react';
import { useCreateTransactionMutation } from 'services/transactionsApiSlice';
import { useGetProductsQuery } from 'services/productsApiSlice';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import SearchableSelect from 'components/ui/SearchableSelect';
import Button from 'components/ui/Button';
import FormGroup from 'components/ui/FormGroup';
import Alert from 'components/ui/Alert';
import { useNavigate } from 'react-router-dom';

function AddTransactionPage() {
  const navigate = useNavigate();
  const [createTransaction] = useCreateTransactionMutation();
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useGetProductsQuery();
  const products = productsData?.data ?? [];

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState('EXIT');
  const [notes, setNotes] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [availableStock, setAvailableStock] = useState(0);

  useEffect(() => {
    if (productId && products) {
      const selectedProduct = products.find(p => p.id === parseInt(productId));
      if (selectedProduct) {
        setAvailableStock(selectedProduct.stock);
      } else {
        setAvailableStock(0);
      }
    }
  }, [productId, products]);

  async function handleSave(e) {
    e.preventDefault();

    const selectedProduct = products.find((p) => p.id === parseInt(productId));

    if (!selectedProduct) {
      setAlertMessage('Product not found.');
      setAvailableStock(0);
      return;
    }

    if (type === 'EXIT') {
      if (selectedProduct.stock <= 0 || quantity > selectedProduct.stock) {
        setAlertMessage(`Not enough stock. Available = ${selectedProduct.stock}`);
        return;
      }
    }

    setAlertMessage('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        console.error('User not authenticated or user ID not found.');
        // Optionally redirect to login
        return;
      }

      const newTransaction = {
        product_id: parseInt(productId),
        user_id: user.id,
        type: type,
        quantity: Number(quantity),
        date: new Date().toISOString(), // Use ISO string for backend
        notes: notes,
      };

      await createTransaction(newTransaction).unwrap();
      navigate('/transactions');

      setProductId('');
      setQuantity(1);
      setType('EXIT');
      setNotes('');
    } catch (err) {
      console.error('Failed to create transaction:', err);
      // TODO: Display error message to user
    }
  }

  const productOptions = productsLoading ? [] : products.map(p => ({ value: p.id, label: p.title }));
  const typeOptions = [{ value: 'EXIT', label: 'EXIT' }, { value: 'ENTRY', label: 'ENTRY' }];

  if (productsLoading) return <div>Loading products...</div>;
  if (productsError) return <div>Error loading products: {productsError.message}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-text mb-6">Add New Transaction</h2>
      <form onSubmit={handleSave}>
        <FormGroup label="Product" htmlFor="productId">
          <SearchableSelect
            id="productId"
            value={productId}
            onChange={setProductId}
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
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </FormGroup>

        <FormGroup label="Type" htmlFor="type">
          <Select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={typeOptions}
            required
          />
        </FormGroup>

        <FormGroup label="Notes" htmlFor="notes">
          <Input
            type="text"
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FormGroup>

        <Button type="submit" variant="primary">Save Transaction</Button>
      </form>

      <Alert message={alertMessage} variant="warning" onClose={() => setAlertMessage('')} />
    </div>
  );
}

export default AddTransactionPage;