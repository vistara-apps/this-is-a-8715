import React, { useState } from 'react'
import { ExternalLink, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

function RecentTransactions() {
  const [transactions] = useState([
    {
      id: 'tx_001',
      amount: '125.50 SOL',
      recipient: '7xKXtg...9YBz',
      status: 'completed',
      timestamp: '2 min ago',
      fraudScore: 0.1,
      fee: '0.00025 SOL'
    },
    {
      id: 'tx_002',
      amount: '2,450.00 USDC',
      recipient: 'Aa8Kt9...3mFp',
      status: 'pending',
      timestamp: '5 min ago',
      fraudScore: 0.3,
      fee: '0.00025 SOL'
    },
    {
      id: 'tx_003',
      amount: '89.25 SOL',
      recipient: 'Bb9Lq2...7nGr',
      status: 'flagged',
      timestamp: '12 min ago',
      fraudScore: 0.8,
      fee: '0.00025 SOL'
    },
    {
      id: 'tx_004',
      amount: '1,200.00 USDC',
      recipient: 'Cc1Mr4...5hJs',
      status: 'completed',
      timestamp: '1 hour ago',
      fraudScore: 0.2,
      fee: '0.00025 SOL'
    }
  ])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-accent" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-accent'
      case 'pending':
        return 'text-yellow-400'
      case 'flagged':
        return 'text-red-400'
      default:
        return 'text-muted'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        <button className="text-primary text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-bg rounded-md">
            <div className="flex items-center space-x-4">
              {getStatusIcon(tx.status)}
              <div>
                <p className="font-medium">{tx.amount}</p>
                <p className="text-sm text-muted">to {tx.recipient}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`text-sm font-medium capitalize ${getStatusColor(tx.status)}`}>
                {tx.status}
              </p>
              <p className="text-xs text-muted">{tx.timestamp}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-muted">Fraud: {(tx.fraudScore * 100).toFixed(0)}%</span>
                <ExternalLink className="w-3 h-3 text-muted cursor-pointer hover:text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions