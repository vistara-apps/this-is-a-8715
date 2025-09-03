import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

function FraudDetectionChart() {
  const data = [
    { name: 'Jan', fraud: 12, total: 450 },
    { name: 'Feb', fraud: 8, total: 523 },
    { name: 'Mar', fraud: 15, total: 612 },
    { name: 'Apr', fraud: 23, total: 789 },
    { name: 'May', fraud: 18, total: 845 },
    { name: 'Jun', fraud: 11, total: 923 },
  ]

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">AI Fraud Detection</h3>
        <p className="text-muted text-sm">Fraudulent transactions prevented over time</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 20%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(220 10% 60%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(220 10% 60%)"
              fontSize={12}
            />
            <Line 
              type="monotone" 
              dataKey="fraud" 
              stroke="hsl(0 70% 50%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(0 70% 50%)', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="hsl(170 70% 45%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(170 70% 45%)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-muted">Fraud Detected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span className="text-sm text-muted">Total Transactions</span>
        </div>
      </div>
    </div>
  )
}

export default FraudDetectionChart