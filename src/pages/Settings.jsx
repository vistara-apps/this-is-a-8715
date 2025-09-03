import React, { useState } from 'react'
import { User, Shield, Bell, CreditCard, Database, Zap } from 'lucide-react'

function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    fraudAlerts: true,
    paymentUpdates: true,
    systemMaintenance: false,
    weeklyReports: true
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'ai', name: 'AI Settings', icon: Zap },
    { id: 'api', name: 'API Config', icon: Database },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-extrabold mb-2">Settings</h1>
        <p className="text-muted">Manage your account and platform preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-text hover:bg-bg'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Profile Information</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input type="text" defaultValue="John" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" defaultValue="Doe" className="input" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" defaultValue="john@example.com" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input type="text" defaultValue="Acme Inc." className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select className="input">
                    <option>UTC-8 (Pacific)</option>
                    <option>UTC-5 (Eastern)</option>
                    <option>UTC+0 (GMT)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold mb-6">Password</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input type="password" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input type="password" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input type="password" className="input" />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Password
                  </button>
                </form>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-6">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-bg rounded-md">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-muted">Get codes via SMS</p>
                  </div>
                  <button className="btn btn-outline">Setup</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-bg rounded-md">
                    <div>
                      <p className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-muted">
                        {key === 'fraudAlerts' && 'Get notified when fraud is detected'}
                        {key === 'paymentUpdates' && 'Receive updates on payment status'}
                        {key === 'systemMaintenance' && 'Alerts about scheduled maintenance'}
                        {key === 'weeklyReports' && 'Weekly summary of your activity'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, [key]: !value})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-primary' : 'bg-surface'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold mb-6">Current Plan</h3>
                <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-semibold text-primary">Pro Plan</h4>
                      <p className="text-muted">5,000 transactions/month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$79</p>
                      <p className="text-sm text-muted">per month</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="btn btn-outline">Change Plan</button>
                  <button className="btn btn-outline">Cancel Subscription</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-6">Usage This Month</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Transactions</span>
                      <span>3,247 / 5,000</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>API Calls</span>
                      <span>12,847 / 25,000</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{width: '51%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold mb-6">Fraud Detection</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sensitivity Level</label>
                    <select className="input">
                      <option>Low (95% threshold)</option>
                      <option>Medium (75% threshold)</option>
                      <option>High (50% threshold)</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="autoBlock" className="rounded" />
                    <label htmlFor="autoBlock" className="text-sm">
                      Automatically block high-risk transactions
                    </label>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-6">Fee Optimization</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="autoOptimize" className="rounded" defaultChecked />
                    <label htmlFor="autoOptimize" className="text-sm">
                      Automatically optimize transaction fees
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Fee Tolerance</label>
                    <select className="input">
                      <option>Conservative (2x standard)</option>
                      <option>Balanced (1.5x standard)</option>
                      <option>Aggressive (1.2x standard)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">API Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Webhook URL</label>
                  <input 
                    type="url" 
                    placeholder="https://your-app.com/webhooks/solana-payai"
                    className="input" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rate Limit</label>
                  <select className="input">
                    <option>1000 requests/hour</option>
                    <option>5000 requests/hour</option>
                    <option>10000 requests/hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Allowed IPs</label>
                  <textarea 
                    placeholder="Enter IP addresses, one per line"
                    className="input min-h-[100px]"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings