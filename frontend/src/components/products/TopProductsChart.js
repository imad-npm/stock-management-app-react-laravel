import React from 'react';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { getCssVar } from '../../utils/getComputedStyle';

function TopProductsChart({ top5Products }) {
  console.log(top5Products);
  
    if (!top5Products) return null;
  
    const data = {
      labels: top5Products.map((product) => product.title),
      datasets: [{
        label: 'Number of Transactions',
        data: top5Products.map((product) => product.transactions_count),
        backgroundColor: getCssVar('--color-primary') + '99', // 99 is hex for 60% opacity+'/50',
        borderColor: getCssVar('--color-primary')+'CC' ,
        borderWidth: 1,
      }]
    };

    const options = {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Top 5 Products by Transaction Volume',
          font: {
            size: 18,
          }
        },
      },
    };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-background shadow rounded-lg">
      <Bar data={data} options={options} />
    </div>
  )
}

export default TopProductsChart;