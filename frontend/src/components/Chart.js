import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#ffe484", "#36d1c4", "#36a2eb", "#2bff8a", "#b0e1f7", "#ff3b3b", "#ffba93", "#ff67d2"];

export default function Chart({ data, prices }) {
  if (!data.length) return null;
  const chartData = data.map((item, i) => ({
    name: item.symbol.toUpperCase(),
    value: ((prices[item.symbol]?.usd || 0) * item.amount)
  })).filter(d => d.value > 0);

  return (
    <div style={{ margin: "40px 0", padding: 20, background: "#22283a", borderRadius: 14 }}>
      <h4 style={{ color: "#ffe484", marginBottom: 18 }}>Portfolio Allocation</h4>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

