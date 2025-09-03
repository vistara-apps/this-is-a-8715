import React, { useState } from 'react'
import { Play, Pause, MoreHorizontal, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

function PayoutsList() {
  const [batches] = useState([
    {
      id: 'batch_001',
      name: 'Monthly Contractor Payments',
      recipientCount: 25,
      totalAmount: '1,250.50',
      status: 'completed',
      createdAt: '2024-01-15 10:00:00',
      executedAt: '2024-01-15 10:05:23',
      successCount: 25,
      failedCount: 0
    },
    {
      id: 'batch_002',
      name: 'Affiliate Commission Q1',
      recipientCount: 45,
      totalAmount: '2,847.25',
      status: 'processing',
      createdAt: '2024-01-15 09:30:00',
      executedAt: null,
      successCount: 32,
      failedCount: 1
    },
    {
      id: 'batch_003',
      name: 'Supplier Payments',
      recipientCount: 12,
      totalAmount: '8,923.00',
      status: 'scheduled',
      createdAt: '2024-01-15 08:45:00',
      executedAt: null,
      successCount: 0,
      failedCount: 0
    },
    {
      id: 'batch_004',
      name: 'Bug Bounty Rewards',
      recipientCount: 8,
      totalAmount: '456.80',
      status: 'failed',
      createdAt: '2024-01-14 16:20:00',
      executedAt: '2024-01-14 16:25:12',
      successCount: 5,
      failedCount: 3
    }
  ])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-accent" />
      case 'processing':
        return <Play className="w-4 h-4 text-blue-400" />
      case 'scheduled':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-accent bg-accent/10'
      case 'processing':
        return 'text-blue-400 bg-blue-400/10'
      case 'scheduled':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'failed':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-muted bg-muted/10'
    }
  }

  const getProgressPercentage = (batch) => {
    if (batch.status === 'completed') return 100
    if (batch.status === 'scheduled') return 0
    return Math.round(((batch.successCount + batch.failedCount) / batch.recipientCount) * 100)
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Payout Batches</h3>
        <p className="text-muted text-sm">Manage your automated payment distributions</p>
      </div>

      <div className="space-y-4">
        {batches.map((batch) => (
          <div key={batch.id} className="p-4 bg-bg rounded-md border border-surface/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(batch.status)}
                <div>
                  <h4 className="font-semibold">{batch.name}</h4>
                  <p className="text-sm text-muted">Created: {batch.createdAt}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                  {batch.status}
                </span>
                <button className="p-1 hover:bg-surface rounded">
                  <MoreHorizontal className="w-4 h-4 text-muted" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted">Recipients</p>
                <p className="font-semibold">{batch.recipientCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Total Amount</p>
                <p className="font-semibold">{batch.totalAmount} SOL</p>
              </div>
              <div>
                <p className="text-xs text-muted">Successful</p>
                <p className="font-semibold text-accent">{batch.successCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Failed</p>
                <p className="font-semibold text-red-400">{batch.failedCount}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Progress</span>
                <span>{getProgressPercentage(batch)}%</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(batch)}%` }}
                ></div>
              </div>
            </div>

            {batch.status === 'scheduled' && (
              <div className="flex space-x-2">
                <button className="btn btn-primary btn-sm">
                  <Play className="w-3 h-3 mr-1" />
                  Execute Now
                </button>
                <button className="btn btn-outline btn-sm">
                  Edit Batch
                </button>
              </div>
            )}

            {batch.status === 'processing' && (
              <div className="flex space-x-2">
                <button className="btn btn-outline btn-sm">
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </button>
                <button className="btn btn-outline btn-sm">
                  View Details
                </button>
              </div>
            )}

            {(batch.status === 'completed' || batch.status === 'failed') && (
              <div className="flex space-x-2">
                <button className="btn btn-outline btn-sm">
                  View Report
                </button>
                <button className="btn btn-outline btn-sm">
                  Download CSV
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PayoutsList