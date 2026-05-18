'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, CreditCard, Repeat, Users, Package, Send } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', label: 'Home', icon: Home, external: false },
    { href: 'https://app.ghostwareos.com/ghostswap', label: 'Swap', icon: Repeat, external: true },
    { href: 'https://app.ghostwareos.com/ghostsend', label: 'Send', icon: Send, external: true },
    { href: 'https://app.ghostwareos.com/', label: 'Payment', icon: CreditCard, external: true },
  ]

  return (
    <header className="border-b border-dark-800 bg-dark-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo.png" alt="Ghost Logo" width="40" height="40" className="w-10 h-10" />
              </div>
              <span className="text-xl font-bold text-white">GhostWare</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const linkProps = item.external 
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {}
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...linkProps}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'text-accent-400 bg-accent-500/10' 
                        : 'text-dark-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
