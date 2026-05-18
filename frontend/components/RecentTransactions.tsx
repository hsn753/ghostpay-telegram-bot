'use client'

import { ExternalLink } from 'lucide-react'

interface Transaction {
  id: number
  deposit_address: string
  payer_address?: string
  amount: string
  status: string
  created_at: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

function maskAddress(address: string): string {
  if (!address || address.length < 8) return address
  const start = address.slice(0, 4)
  const end = address.slice(-4)
  return `${start}***${end}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-dark-400">
        No recent transactions
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div 
          key={tx.id}
          className="bg-dark-900/50 border border-dark-800 rounded-lg p-4 hover:border-accent-500/30 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                tx.status === 'FINISHED' ? 'bg-green-400' : 
                tx.status === 'PENDING' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span className="text-sm font-medium text-white">
                {tx.status}
              </span>
            </div>
            <span className="text-xs text-dark-400">
              {formatDate(tx.created_at)}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-dark-400">From:</span>
              <code className="text-accent-400 font-mono text-xs">
                {maskAddress(tx.payer_address || tx.deposit_address)}
              </code>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-400">To:</span>
              <code className="text-accent-400 font-mono text-xs">
                {maskAddress(tx.deposit_address)}
              </code>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-dark-800">
              <span className="text-dark-400">Amount:</span>
              <span className="text-white font-semibold">
                {parseFloat(tx.amount || '0').toFixed(4)} SOL
              </span>
            </div>
          </div>
          
          <a
            href={`https://solscan.io/tx/${tx.deposit_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center space-x-2 text-xs text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span>View on Solscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ))}
    </div>
  )
}
