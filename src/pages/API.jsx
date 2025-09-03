import React, { useState } from 'react'
import { Copy, Key, RefreshCw, Eye, EyeOff, Code } from 'lucide-react'

function API() {
  const [apiKey, setApiKey] = useState('sk_live_1234567890abcdef...')
  const [showKey, setShowKey] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState('payments')

  const endpoints = {
    payments: {
      title: 'Initiate Payment',
      method: 'POST',
      url: '/api/v1/payments',
      description: 'Send SOL or SPL tokens to a recipient',
      request: `{
  "recipient": "7xKXtg2aB5nC8dE9fGhIjK...",
  "amount": "125.50",
  "token": "SOL",
  "memo": "Payment for services"
}`,
      response: `{
  "id": "pay_1234567890",
  "status": "pending",
  "signature": "5J7KL8M9...P2Q3R4S5",
  "amount": "125.50",
  "token": "SOL",
  "recipient": "7xKXtg2aB5nC8dE9fGhIjK...",
  "fraud_score": 0.1,
  "estimated_fee": "0.00025",
  "created_at": "2024-01-15T14:32:22Z"
}`
    },
    status: {
      title: 'Check Payment Status',
      method: 'GET',
      url: '/api/v1/payments/{id}',
      description: 'Get the current status of a payment',
      request: 'No request body required',
      response: `{
  "id": "pay_1234567890",
  "status": "completed",
  "signature": "5J7KL8M9...P2Q3R4S5",
  "confirmations": 32,
  "block_height": 123456789,
  "completed_at": "2024-01-15T14:32:45Z"
}`
    },
    payouts: {
      title: 'Create Payout Batch',
      method: 'POST',
      url: '/api/v1/payouts',
      description: 'Distribute funds to multiple recipients',
      request: `{
  "name": "Monthly Contractor Payments",
  "recipients": [
    {
      "address": "7xKXtg2aB5nC8dE9fGhIjK...",
      "amount": "125.50",
      "memo": "Payment for John"
    },
    {
      "address": "Aa8Kt9uF3mGp7qR2sT5vW...",
      "amount": "200.00",
      "memo": "Payment for Jane"
    }
  ]
}`,
      response: `{
  "batch_id": "batch_1234567890",
  "status": "processing",
  "recipient_count": 2,
  "total_amount": "325.50",
  "estimated_fees": "0.00050",
  "created_at": "2024-01-15T14:32:22Z"
}`
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const generateNewKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + '...'
    setApiKey(newKey)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-extrabold mb-2">API Documentation</h1>
        <p className="text-muted">Integrate Solana payments into your application</p>
      </div>

      {/* API Key Management */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">API Key Management</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your API Key</label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="input pr-10"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showKey ? <EyeOff className="w-4 h-4 text-muted" /> : <Eye className="w-4 h-4 text-muted" />}
                </button>
              </div>
              <button
                onClick={() => copyToClipboard(apiKey)}
                className="btn btn-outline"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={generateNewKey}
                className="btn btn-secondary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </button>
            </div>
            <p className="text-xs text-muted mt-2">
              Keep your API key secure. Don't share it in publicly accessible areas.
            </p>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Endpoints</h3>
            <nav className="space-y-2">
              {Object.entries(endpoints).map(([key, endpoint]) => (
                <button
                  key={key}
                  onClick={() => setSelectedEndpoint(key)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedEndpoint === key 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-bg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{endpoint.title}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      endpoint.method === 'POST' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {endpoint.method}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{endpoints[selectedEndpoint].title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  endpoints[selectedEndpoint].method === 'POST' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {endpoints[selectedEndpoint].method}
                </span>
                <code className="px-3 py-1 bg-bg rounded text-sm font-mono">
                  {endpoints[selectedEndpoint].url}
                </code>
              </div>
            </div>

            <p className="text-muted mb-6">{endpoints[selectedEndpoint].description}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Request</h4>
                  <button
                    onClick={() => copyToClipboard(endpoints[selectedEndpoint].request)}
                    className="p-1 hover:bg-bg rounded"
                  >
                    <Copy className="w-4 h-4 text-muted" />
                  </button>
                </div>
                <pre className="bg-bg p-4 rounded-md text-sm font-mono overflow-x-auto">
                  <code>{endpoints[selectedEndpoint].request}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Response</h4>
                  <button
                    onClick={() => copyToClipboard(endpoints[selectedEndpoint].response)}
                    className="p-1 hover:bg-bg rounded"
                  >
                    <Copy className="w-4 h-4 text-muted" />
                  </button>
                </div>
                <pre className="bg-bg p-4 rounded-md text-sm font-mono overflow-x-auto">
                  <code>{endpoints[selectedEndpoint].response}</code>
                </pre>
              </div>
            </div>

            {/* Code Examples */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Code Examples</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">cURL</h5>
                  <pre className="bg-bg p-4 rounded-md text-sm font-mono overflow-x-auto">
                    <code>{`curl -X ${endpoints[selectedEndpoint].method} \\
  https://api.solanapayai.com${endpoints[selectedEndpoint].url} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${endpoints[selectedEndpoint].request}'`}</code>
                  </pre>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">JavaScript</h5>
                  <pre className="bg-bg p-4 rounded-md text-sm font-mono overflow-x-auto">
                    <code>{`const response = await fetch('https://api.solanapayai.com${endpoints[selectedEndpoint].url}', {
  method: '${endpoints[selectedEndpoint].method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${endpoints[selectedEndpoint].request})
});

const data = await response.json();
console.log(data);`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Authentication</h3>
        <p className="text-muted mb-4">
          All API requests must include your API key in the Authorization header:
        </p>
        <pre className="bg-bg p-4 rounded-md text-sm font-mono">
          <code>Authorization: Bearer YOUR_API_KEY</code>
        </pre>
      </div>

      {/* Rate Limits */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Rate Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">1000</p>
            <p className="text-sm text-muted">Requests per hour</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">100</p>
            <p className="text-sm text-muted">Payments per minute</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">10</p>
            <p className="text-sm text-muted">Batch payouts per hour</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default API