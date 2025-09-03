import React, { useState } from 'react'
import { Send, Plus, Filter, Search } from 'lucide-react'
import PaymentForm from '../components/PaymentForm'
import PaymentsList from '../components/PaymentsList'

function Payments() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-5xl font-extrabold mb-2">Payments</h1>
          <p className="text-muted">Manage your Solana payments and transactions</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Payment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input w-full sm:w-auto"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      <PaymentsList searchTerm={searchTerm} filterStatus={filterStatus} />

      {showForm && (
        <PaymentForm onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

export default Payments