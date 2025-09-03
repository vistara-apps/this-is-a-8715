import React from 'react'

function StatsCard({ title, value, change, trend, icon: Icon }) {
  const isPositive = trend === 'up'
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className={`text-sm mt-1 ${isPositive ? 'text-accent' : 'text-red-400'}`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${isPositive ? 'bg-accent/20' : 'bg-red-400/20'}`}>
          <Icon className={`w-6 h-6 ${isPositive ? 'text-accent' : 'text-red-400'}`} />
        </div>
      </div>
    </div>
  )
}

export default StatsCard