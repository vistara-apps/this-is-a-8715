import React, { useState } from 'react'
import { ExternalLink, AlertTriangle, CheckCircle, Clock, X, Copy } from 'lucide-react'

function PaymentsList({ searchTerm, filterStatus }) {
  const [payments] = useState([
    {
      id: 'pay_001',
      signature: '5J7KL8M9...P2Q3R4S5',
      amount: '125.50',
      token: 'SOL',
      recipient: '7xKXtg2aB5nC8dE9fGhIjK...mNoPqRsTuVwXyZ1234567890',
      status: 'completed',
      timestamp: '2024-01-15 14:32:22',
      fraudScore: 0.1,
      fee: '0.00025',
      memo: 'Payment for services'
    },
    {
      id: 'pay_002',
      signature: '6K8L9M0N...Q3R4S5T6',
      amount: '2450.00',
      token: 'USDC',
      recipient: 'Aa8Kt9uF3mGp7qR2sT5vW...xYz0123456789AbCdEfGhIj',
      status: 'pending',
      timestamp: '2024-01-15 14:27:15',
      fraudScore: 0.3,
      fee: '0.00025',
      memo: 'Bulk transfer'
    },
    {
      id: 'pay_003',
      signature: '7L9M0N1P...R4S5T6U7',
      amount: '89.25',
      token: 'SOL',
      recipient: 'Bb9Lq2nH4jIp8rS3tU6vX...yZ1234567890AbCdEfGhIjK',
      status: 'flagged',
      timestamp: '2024-01-15 14:20:08',
      fraudScore: 0.8,
      fee: '0.00025',
      memo: 'Suspicious activity detected'
    },
    {
      id: 'pay_004',
      signature: '8M0N1P2Q...S5T6U7V8',
      amount: '1200.00',
      token: 'USDC',
      recipient: 'Cc1Mr4kL7nIp9rS4tU7vX...zA234567890AbCdEfGhIjKl',
      status: 'completed',
      timestamp: '2024-01-15 13:45:33',
      fraudScore: 0.2,
      fee: '0.00025',
      memo: 'Invoice payment #1234'
    },
    {
      id: 'pay_005',
      signature: '9N1P2Q3R...T6U7V8W9',
      amount: '75.80',
      token: 'SOL',
      recipient: 'Dd2Ns5mM8oJq0sT5uV8wY...aB345678901AbCdEfGhIjKl',
      status: 'failed',
      timestamp: '2024-01-15 13:30:45',
      fraudScore: 0.1,
      fee: '0.00025',
      memo: 'Refund processing'
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
      case 'failed':
        return <X className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-accent bg-accent/10'
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'flagged':
        return 'text-red-400 bg-red-400/10'
      case 'failed':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-muted bg-muted/10'
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.signature.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.memo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Payment History</h3>
        <p className="text-muted text-sm">
          Showing {filteredPayments.length} of {payments.length} transactions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface/50">
              <th className="text-left py-3 px-4 font-medium text-muted">Transaction</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Recipient</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Status</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Fraud Score</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-surface/30 hover:bg-bg/50">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-mono text-sm">{payment.signature}</p>
                    <p className="text-xs text-muted mt-1">{payment.memo}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-semibold">{payment.amount} {payment.token}</p>
                    <p className="text-xs text-muted">Fee: {payment.fee} SOL</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {payment.recipient.slice(0, 8)}...{payment.recipient.slice(-8)}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(payment.recipient)}
                      className="p-1 hover:bg-surface rounded"
                    >
                      <Copy className="w-3 h-3 text-muted" />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(payment.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${payment.fraudScore > 0.7 ? 'bg-red-400' : payment.fraudScore > 0.4 ? 'bg-yellow-400' : 'bg-accent'}`}></div>
                    <span className="text-sm">{(payment.fraudScore * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm">{payment.timestamp}</p>
                </td>
                <td className="py-4 px-4">
                  <button className="p-1 hover:bg-surface rounded">
                    <ExternalLink className="w-4 h-4 text-muted hover:text-primary" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted">No transactions found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default PaymentsList