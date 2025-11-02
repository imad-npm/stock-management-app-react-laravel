import React from 'react';
import 'chart.js/auto';
import TypesChart from 'components/transactions/TypesChart';
import TopProductsChart from 'components/products/TopProductsChart';
import { useGetDashboardStatsQuery } from 'services/dashboardApiSlice';
import ProductsIcon from 'components/ui/icons/ProductsIcon';
import TransactionsIcon from 'components/ui/icons/TransactionsIcon';
import StockIcon from 'components/ui/icons/StockIcon';
import CategoriesIcon from 'components/ui/icons/CategoriesIcon';

function DashboardPage() {
  const { data: dashboardStats, isLoading, isError, error } = useGetDashboardStatsQuery();

  if (isLoading) return <div>Loading dashboard data...</div>;
  if (isError) return <div>Error loading dashboard data: {error.message}</div>;

  const { totalProducts, totalTransactions, totalStock, totalCategories, top5Products, transactionTypeCounts } = dashboardStats;

  const stats = [
    { name: 'Total Products', stat: totalProducts, icon: ProductsIcon },
    { name: 'Total Transactions', stat: totalTransactions, icon: TransactionsIcon },
    { name: 'Total Stock', stat: totalStock, icon: StockIcon },
    { name: 'Total Categories', stat: totalCategories, icon: CategoriesIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">All-Time Stats</h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
              <dt>
                <div className="absolute bg-indigo-500 rounded-md p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <TypesChart transactionTypeCounts={transactionTypeCounts} />
        <TopProductsChart top5Products={top5Products} />
      </div>
    </div>
  );
}

export default DashboardPage;
