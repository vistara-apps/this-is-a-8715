import React, { useState } from 'react'
import { X, Plus, Trash2, Send } from 'lucide-react'

function PayoutForm({ onClose }) {
  const [batchName, setBatchName] = useState('')
  const [recipients, setRecipients] = useState([
    { address: '', amount: '', memo: '' }
  ])

  const addRecipient = () => {
    setRecipients([...recipients, { address: '', amount: '', memo: '' }])
  }

  const removeRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const updateRecipient = (index, field, value) => {
    const updated = recipients.map((recipient, i) => 
      i === index ? { ...recipient, [field]: value } : recipient
    )
    setRecipients(updated)
  }

  const getTotalAmount = () => {
    return recipients.reduce((total, recipient) => {
      return total + (parseFloat(recipient.amount) || 0)
    }, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process batch payout
    alert('Payout batch created successfully!')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-modal">
        <div className="flex items-center justify-between p-6 border-b border-surface/50">
          <h2 className="text-xl font-semibold">Create Payout Batch</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-bg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Batch Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Monthly Contractor Payments"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recipients</h3>
                <button 
                  type="button"
                  onClick={addRecipient}
                  className="btn btn-outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recipient
                </button>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto">
                {recipients.map((recipient, index) => (
                  <div key={index} className="p-4 bg-bg rounded-md border border-surface/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Recipient {index + 1}</span>
                      {recipients.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeRecipient(index)}
                          className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">Wallet Address</label>
                        <input
                          type="text"
                          required
                          placeholder="Solana wallet address"
                          value={recipient.address}
                          onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                          className="input text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">Amount (SOL)</label>
                        <input
                          type="number"
                          step="0.000001"
                          required
                          placeholder="0.00"
                          value={recipient.amount}
                          onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                          className="input text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">Memo (Optional)</label>
                        <input
                          type="text"
                          placeholder="Payment description"
                          value={recipient.memo}
                          onChange={(e) => updateRecipient(index, 'memo', e.target.value)}
                          className="input text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-bg">
              <h4 className="font-semibold mb-3">Batch Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Recipients:</span>
                  <span>{recipients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Amount:</span>
                  <span className="font-semibold">{getTotalAmount().toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Network Fees:</span>
                  <span>~{(recipients.length * 0.00025).toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Cost:</span>
                  <span className="font-semibold">{(getTotalAmount() + recipients.length * 0.00025).toFixed(6)} SOL</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex space-x-3 p-6 border-t border-surface/50">
          <button 
            type="button"
            onClick={onClose}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="btn btn-primary flex-1"
          >
            <Send className="w-4 h-4 mr-2" />
            Create & Execute Batch
          </button>
        </div>
      </div>
    </div>
  )
}

export default PayoutForm