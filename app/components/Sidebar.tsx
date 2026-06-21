'use client'

import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', icon: '⊞' },
  { label: 'Records', icon: '◫' },
  { label: 'Users', icon: '👤' },
  { label: 'Reports', icon: '📊' },
  { label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const [active, setActive] = useState('Records')
  const [dark, setDark] = useState(true)

  return (
    <div className={`flex flex-col w-48 min-h-screen ${dark ? 'bg-[#1a3a2a]' : 'bg-[#f4f7f0] border-r border-[#d0dcc8]'}`}>
      
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-5 border-b ${dark ? 'border-white/10' : 'border-[#d0dcc8]'}`}>
        <div className="w-7 h-7 bg-[#c8d96a] rounded-md flex items-center justify-center text-[#1a3a2a] font-bold text-sm">G</div>
        <div>
          <div className={`text-sm font-medium ${dark ? 'text-[#c8d96a]' : 'text-[#1a3a2a]'}`}>GreenShield</div>
          <div className={`text-[10px] ${dark ? 'text-white/40' : 'text-[#7a9070]'}`}>Secure. Reliable.</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActive(item.label)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors
              ${active === item.label
                ? dark
                  ? 'bg-[#c8d96a]/15 text-[#c8d96a] border-l-2 border-[#c8d96a] pl-[14px]'
                  : 'bg-[#e2edda] text-[#1a3a2a] border-l-2 border-[#1a3a2a] pl-[14px] font-medium'
                : dark
                  ? 'text-white/55 hover:text-white/80'
                  : 'text-[#4a6a40] hover:bg-[#e2edda]'
              }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className={`px-4 py-3 border-t ${dark ? 'border-white/10' : 'border-[#d0dcc8]'}`}>
        <button
          onClick={() => setDark(!dark)}
          className={`w-full text-xs py-1.5 rounded-md border transition-colors
            ${dark ? 'border-white/20 text-white/50 hover:text-white/80' : 'border-[#d0dcc8] text-[#7a9070] hover:bg-[#e2edda]'}`}
        >
          {dark ? '☀ Light theme' : '🌙 Dark theme'}
        </button>
      </div>

      {/* User */}
      <div className={`px-4 py-4 border-t ${dark ? 'border-white/10' : 'border-[#d0dcc8]'}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#c8d96a]/20 flex items-center justify-center text-[#c8d96a] text-xs">A</div>
          <div>
            <div className={`text-xs font-medium ${dark ? 'text-white' : 'text-[#1a3a2a]'}`}>Admin User</div>
            <div className={`text-[10px] ${dark ? 'text-white/40' : 'text-[#7a9070]'}`}>Administrator</div>
          </div>
        </div>
      </div>

    </div>
  )
}