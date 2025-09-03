import React, { useState } from 'react'
import { X, Send, AlertCircle } from 'lucide-react'

function PaymentForm({ onClose }) {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    token: 'SOL',
    memo: ''
  })
  const [loading, setLoading] = useState(false)
  const [fraudWarning, setFraudWarning] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate AI fraud detection
    setTimeout(() => {
      const fraudScore = Math.random()
      if (fraudScore > 0.7) {
        setFraudWarning({
          score: (fraudScore * 100).toFixed(0),
          reason: 'Unusual recipient address pattern detected'
        })
      } else {
        // Proceed with payment
        alert('Payment initiated successfully!')
        onClose()
      }
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg w-full max-w-md shadow-modal">
        <div className="flex items-center justify-between p-6 border-b border-surface/50">
          <h2 className="text-xl font-semibold">Send Payment</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-bg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recipient Address</label>
            <input
              type="text"
              required
              placeholder="Enter Solana wallet address"
              value={formData.recipient}
              onChange={(e) => setFormData({...formData, recipient: e.target.value})}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.000001"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Token</label>
              <select
                value={formData.token}
                onChange={(e) => setFormData({...formData, token: e.target.value})}
                className="input"
              >
                <option value="SOL">SOL</option>
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Memo (Optional)</label>
            <input
              type="text"
              placeholder="Payment description"
              value={formData.memo}
              onChange={(e) => setFormData({...formData, memo: e.target.value})}
              className="input"
            />
          </div>

          {fraudWarning && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-medium text-red-400">Fraud Alert</span>
              </div>
              <p className="text-sm text-red-300 mt-1">
                Risk Score: {fraudWarning.score}% - {fraudWarning.reason}
              </p>
              <div className="mt-3 space-x-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline text-red-400 border-red-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Proceed Anyway
                </button>
              </div>
            </div>
          )}

          {!fraudWarning && (
            <div className="flex space-x-3 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Payment
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default PaymentForm