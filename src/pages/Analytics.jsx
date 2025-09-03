import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, Shield, Clock } from 'lucide-react'

function Analytics() {
  const volumeData = [
    { month: 'Jan', volume: 12450, transactions: 456 },
    { month: 'Feb', volume: 15230, transactions: 523 },
    { month: 'Mar', volume: 18900, transactions: 612 },
    { month: 'Apr', volume: 22100, transactions: 789 },
    { month: 'May', volume: 26750, transactions: 845 },
    { month: 'Jun', volume: 31200, transactions: 923 },
  ]

  const fraudData = [
    { day: 'Mon', prevented: 5, total: 120 },
    { day: 'Tue', prevented: 8, total: 135 },
    { day: 'Wed', prevented: 3, total: 98 },
    { day: 'Thu', prevented: 12, total: 156 },
    { day: 'Fri', prevented: 7, total: 142 },
    { day: 'Sat', prevented: 4, total: 89 },
    { day: 'Sun', prevented: 6, total: 105 },
  ]

  const tokenDistribution = [
    { name: 'SOL', value: 65, color: '#9945FF' },
    { name: 'USDC', value: 25, color: '#2775CA' },
    { name: 'USDT', value: 8, color: '#26a17b' },
    { name: 'Other', value: 2, color: '#6b7280' },
  ]

  const feeOptimization = [
    { time: '00:00', standard: 0.00025, optimized: 0.00018 },
    { time: '04:00', standard: 0.00025, optimized: 0.00020 },
    { time: '08:00', standard: 0.00025, optimized: 0.00015 },
    { time: '12:00', standard: 0.00025, optimized: 0.00022 },
    { time: '16:00', standard: 0.00025, optimized: 0.00017 },
    { time: '20:00', standard: 0.00025, optimized: 0.00019 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-extrabold mb-2">Analytics</h1>
        <p className="text-muted">Insights into your payment performance and AI optimizations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Total Volume</p>
              <p className="text-2xl font-bold">156,783 SOL</p>
              <p className="text-sm text-accent">+23.4% vs last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Fraud Prevented</p>
              <p className="text-2xl font-bold">247</p>
              <p className="text-sm text-red-400">-12.1% vs last month</p>
            </div>
            <Shield className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Avg Processing Time</p>
              <p className="text-2xl font-bold">2.1s</p>
              <p className="text-sm text-accent">-0.3s vs last month</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Fee Savings</p>
              <p className="text-2xl font-bold">47.8 SOL</p>
              <p className="text-sm text-accent">+18.7% vs last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volume Trends */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Payment Volume Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 20%)" />
                <XAxis dataKey="month" stroke="hsl(220 10% 60%)" fontSize={12} />
                <YAxis stroke="hsl(220 10% 60%)" fontSize={12} />
                <Bar dataKey="volume" fill="hsl(170 70% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud Detection */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Fraud Detection Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fraudData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 20%)" />
                <XAxis dataKey="day" stroke="hsl(220 10% 60%)" fontSize={12} />
                <YAxis stroke="hsl(220 10% 60%)" fontSize={12} />
                <Line 
                  type="monotone" 
                  dataKey="prevented" 
                  stroke="hsl(0 70% 50%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(0 70% 50%)', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(170 70% 45%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(170 70% 45%)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Distribution */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Token Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tokenDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {tokenDistribution.map((token) => (
              <div key={token.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: token.color }}
                ></div>
                <span className="text-sm">{token.name} ({token.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Optimization */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">AI Fee Optimization</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feeOptimization}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 20%)" />
                <XAxis dataKey="time" stroke="hsl(220 10% 60%)" fontSize={12} />
                <YAxis stroke="hsl(220 10% 60%)" fontSize={12} />
                <Line 
                  type="monotone" 
                  dataKey="standard" 
                  stroke="hsl(220 10% 60%)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(220 10% 60%)', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="optimized" 
                  stroke="hsl(170 70% 45%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(170 70% 45%)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-muted"></div>
              <span className="text-sm text-muted">Standard Fee</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-accent"></div>
              <span className="text-sm text-muted">AI Optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-md">
              <h4 className="font-semibold text-accent">Optimal Payment Window</h4>
              <p className="text-sm text-muted mt-1">
                Peak efficiency detected between 8AM-10AM UTC with 34% lower fees
              </p>
            </div>
            <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-md">
              <h4 className="font-semibold text-yellow-400">Fraud Pattern Alert</h4>
              <p className="text-sm text-muted mt-1">
                Unusual activity spike on Thursdays - enhanced monitoring active
              </p>
            </div>
            <div className="p-4 bg-blue-400/10 border border-blue-400/20 rounded-md">
              <h4 className="font-semibold text-blue-400">Network Congestion</h4>
              <p className="text-sm text-muted mt-1">
                Expected high traffic in 2 hours - pre-loading optimal fee rates
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted">Success Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-surface rounded-full">
                  <div className="w-[96%] h-2 bg-accent rounded-full"></div>
                </div>
                <span className="text-sm font-semibold">99.6%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Fraud Detection Accuracy</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-surface rounded-full">
                  <div className="w-[94%] h-2 bg-red-400 rounded-full"></div>
                </div>
                <span className="text-sm font-semibold">94.2%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Fee Optimization</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-surface rounded-full">
                  <div className="w-[87%] h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-sm font-semibold">87.1%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">API Uptime</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-surface rounded-full">
                  <div className="w-[99.9%] h-2 bg-accent rounded-full"></div>
                </div>
                <span className="text-sm font-semibold">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics