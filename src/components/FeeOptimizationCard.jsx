import React from 'react'
import { TrendingDown, Zap } from 'lucide-react'

function FeeOptimizationCard() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Smart Fee Optimization</h3>
        <Zap className="w-5 h-5 text-accent" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-bg rounded-md">
          <div>
            <p className="text-sm text-muted">Current Network Fee</p>
            <p className="font-semibold">0.00025 SOL</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">AI Recommended</p>
            <p className="font-semibold text-accent">0.00018 SOL</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <TrendingDown className="w-4 h-4 text-accent" />
          <span className="text-accent">28% savings</span>
          <span className="text-muted">with 95% success rate</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Network Congestion</span>
            <span className="text-accent">Low</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Estimated Confirmation</span>
            <span>~2 seconds</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">This Month Saved</span>
            <span className="text-accent">15.7 SOL</span>
          </div>
        </div>

        <button className="btn btn-primary w-full mt-4">
          Apply AI Recommendations
        </button>
      </div>
    </div>
  )
}

export default FeeOptimizationCard