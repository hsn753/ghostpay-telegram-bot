'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ProductStats {
  links: { count: number; volume: number }
  swaps: { count: number; volume: number }
  sends: { count: number; volume: number }
}

interface ProductPieChartProps {
  productStats: ProductStats
}

const COLORS = {
  'GhostPay Links': '#0ea5e9',
  'GhostSwap': '#10b981',
  'GhostSend': '#8b5cf6'
}

export function ProductPieChart({ productStats }: ProductPieChartProps) {
  const chartData = [
    {
      name: 'GhostPay Links',
      value: productStats.links.count,
      color: COLORS['GhostPay Links']
    },
    {
      name: 'GhostSwap',
      value: productStats.swaps.count,
      color: COLORS['GhostSwap']
    },
    {
      name: 'GhostSend',
      value: productStats.sends.count,
      color: COLORS['GhostSend']
    }
  ].filter(item => item.value > 0)

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <div className="h-full flex items-center justify-center text-dark-400">
        No transaction data available
      </div>
    )
  }

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Product Breakdown</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-dark-300">{item.name}</span>
            </div>
            <span className="text-white font-medium">{item.value} txs</span>
          </div>
        ))}
      </div>
    </div>
  )
}
