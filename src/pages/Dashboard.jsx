import React from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import RecentTransactions from '../components/RecentTransactions'
import FraudDetectionChart from '../components/FraudDetectionChart'
import FeeOptimizationCard from '../components/FeeOptimizationCard'

function Dashboard() {
  const stats = [
    {
      title: 'Total Volume',
      value: '24,893 SOL',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Active Transactions',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Zap
    },
    {
      title: 'Fraud Prevented',
      value: '23',
      change: '-4.1%',
      trend: 'down',
      icon: AlertTriangle
    },
    {
      title: 'Fee Savings',
      value: '15.7 SOL',
      change: '+23.4%',
      trend: 'up',
      icon: TrendingDown
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-extrabold mb-2">Dashboard</h1>
        <p className="text-muted">Welcome back! Here's what's happening with your Solana payments.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentTransactions />
          <FraudDetectionChart />
        </div>
        
        <div className="space-y-8">
          <FeeOptimizationCard />
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn btn-primary w-full">Send Payment</button>
              <button className="btn btn-outline w-full">Create Payout</button>
              <button className="btn btn-outline w-full">Generate API Key</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard