import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Chart({ data, prices }) {
  const labels = data.map(item => item.symbol);
  const values = data.map(item => (prices[item.symbol]?.usd || 0) * item.amount);

  return (
    <div style={{ width: 400, margin: 'auto' }}>
      <Pie
        data={{
          labels,
          datasets: [{ data: values, backgroundColor: ['#ffce56','#36a2eb','#ff6384','#4bc0c0'] }]
        }}
        options={{
          plugins: { legend: { position: 'bottom' } }
        }}
      />
    </div>
  );
}

