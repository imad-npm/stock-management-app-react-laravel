
const generateTransactions = (count) => {
  const products = ['iPhone X', 'Huawei P30', 'MacBook Pro', 'iPhone 9']; // Array of products
  const transactions = [];
  
  for (let i = 1; i <= count; i++) {
    const product = products[Math.floor(Math.random() * products.length)]; // Select a random product from the array
    const quantity = Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10
    const year = 2020;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 31);
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    const date = new Date(year, month, day, hour, minute, second);
    const dateString = date.toLocaleString("en-US", { hour12: true });



    transactions.push({
      id: i,
      product,
      quantity,
      date:dateString ,
      type: Math.random() < 0.5 ? 'EXIT' : 'ENTRY', // Randomly set type as EXIT or ENTRY
    });
  }
  
  return transactions;
};

export default generateTransactions