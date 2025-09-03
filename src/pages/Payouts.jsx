import React, { useState } from 'react'
import { Plus, Upload, Download, Play } from 'lucide-react'
import PayoutForm from '../components/PayoutForm'
import PayoutsList from '../components/PayoutsList'

function Payouts() {
  const [showForm, setShowForm] = useState(false)
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-5xl font-extrabold mb-2">Automated Payouts</h1>
          <p className="text-muted">Distribute funds to multiple recipients automatically</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="btn btn-outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-3xl font-bold">47</p>
          <p className="text-muted text-sm mt-1">Active Batches</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold">2,134</p>
          <p className="text-muted text-sm mt-1">Recipients This Month</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold">15,678 SOL</p>
          <p className="text-muted text-sm mt-1">Total Distributed</p>
        </div>
      </div>

      <PayoutsList />

      {showForm && (
        <PayoutForm onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

export default Payouts