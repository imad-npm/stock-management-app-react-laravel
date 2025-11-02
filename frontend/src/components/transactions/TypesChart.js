import React from 'react';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { getCssVar } from '../../utils/getComputedStyle';

function TypesChart({ transactionTypeCounts }) {
    if (!transactionTypeCounts) return null;

    const data = {
        labels: ['Entries', 'Exits'],
        datasets: [{
            label: 'Number of Transactions',
            data: [transactionTypeCounts.ENTRY, transactionTypeCounts.EXIT],
            backgroundColor: [
                getCssVar('--color-primary') + '99',
                getCssVar('--color-accent') + '99',
            ],
            borderColor: [
                getCssVar('--color-primary') + 'CC',
                getCssVar('--color-accent') + 'CC',
            ],
            borderWidth: 1,
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Transaction Types',
                font: {
                    size: 18,
                }
            },
        },
    };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-background shadow rounded-lg">
      <Bar data={data} options={options} />
    </div>
  )
}

export default TypesChart;