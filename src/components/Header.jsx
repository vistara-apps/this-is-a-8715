import React from 'react'
import { Menu, Bell, User } from 'lucide-react'

function Header({ onMenuClick }) {
  return (
    <header className="h-16 bg-surface border-b border-surface/50 flex items-center justify-between px-4 lg:px-8">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md hover:bg-bg"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div className="flex items-center space-x-4 ml-auto">
        <button className="p-2 rounded-md hover:bg-bg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted">Pro Plan</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header