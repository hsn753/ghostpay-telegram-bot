'use client'

import { useState } from 'react'
import { ArrowDownUp, TrendingUp, Zap, Shield, Info, Settings, ArrowDown } from 'lucide-react'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default function SwapPage() {
  const [fromToken, setFromToken] = useState('SOL')
  const [toToken, setToToken] = useState('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [slippage, setSlippage] = useState('0.5')

  const tokens = [
    { symbol: 'SOL', name: 'Solana', price: 98.45, change: '+5.2%', logo: '◎' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: '+0.1%', logo: '○' },
    { symbol: 'USDT', name: 'Tether', price: 1.00, change: '0.0%', logo: '◈' },
    { symbol: 'ETH', name: 'Ethereum', price: 2340.80, change: '+3.1%', logo: '◆' },
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change: '+2.8%', logo: '₿' },
  ]

  const recentTrades = [
    { pair: 'SOL/USDC', volume: '$2.4M', change: '+5.2%' },
    { pair: 'ETH/USDT', volume: '$1.8M', change: '+3.1%' },
    { pair: 'BTC/USDC', volume: '$3.2M', change: '+2.8%' },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <CursorTracker />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">GhostSwap</h1>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Trade cryptocurrencies with the best rates and deepest liquidity across multiple blockchain networks.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Swap Interface */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Swap Tokens</h2>
                <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-dark-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* From Token */}
                <div className="bg-dark-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-dark-400 text-sm">From</label>
                    <span className="text-dark-400 text-sm">Balance: 12.45 SOL</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent text-2xl font-semibold text-white placeholder-dark-500 flex-1 outline-none"
                    />
                    <div className="flex items-center space-x-2 bg-dark-700 hover:bg-dark-600 rounded-lg px-4 py-2 cursor-pointer transition-colors">
                      <span className="text-xl">◎</span>
                      <span className="font-medium text-white">SOL</span>
                      <ArrowDown className="w-4 h-4 text-dark-400" />
                    </div>
                  </div>
                  <div className="text-right text-dark-400 text-sm mt-2">≈ $1,230.45</div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center">
                  <button className="p-3 bg-dark-800 hover:bg-accent-500 rounded-xl transition-colors group">
                    <ArrowDownUp className="w-5 h-5 text-dark-400 group-hover:text-white transition-colors" />
                  </button>
                </div>

                {/* To Token */}
                <div className="bg-dark-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-dark-400 text-sm">To</label>
                    <span className="text-dark-400 text-sm">Balance: 1,234.56 USDC</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent text-2xl font-semibold text-white placeholder-dark-500 flex-1 outline-none"
                      readOnly
                    />
                    <div className="flex items-center space-x-2 bg-dark-700 hover:bg-dark-600 rounded-lg px-4 py-2 cursor-pointer transition-colors">
                      <span className="text-xl">○</span>
                      <span className="font-medium text-white">USDC</span>
                      <ArrowDown className="w-4 h-4 text-dark-400" />
                    </div>
                  </div>
                  <div className="text-right text-dark-400 text-sm mt-2">≈ $1,230.45</div>
                </div>

                {/* Trade Details */}
                <div className="bg-dark-800/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Rate</span>
                    <span className="text-white">1 SOL = 98.45 USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Price Impact</span>
                    <span className="text-green-400">0.03%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Network Fee</span>
                    <span className="text-white">~0.001 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Slippage</span>
                    <span className="text-white">{slippage}%</span>
                  </div>
                </div>

                {/* Swap Button */}
                <button className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Swap Tokens</span>
                </button>

                {/* Info Banner */}
                <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-accent-400 font-medium mb-1">Best Price Guaranteed</div>
                    <div className="text-dark-300 text-sm">
                      GhostSwap aggregates liquidity from multiple DEXs to ensure you get the best possible rates.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Info Sidebar */}
          <div className="space-y-6">
            {/* Market Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Market Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-dark-400">24h Volume</span>
                  <span className="text-white font-medium">$47.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Total Liquidity</span>
                  <span className="text-white font-medium">$156.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Active Pairs</span>
                  <span className="text-white font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Avg. Swap Time</span>
                  <span className="text-green-400 font-medium">0.8s</span>
                </div>
              </div>
            </div>

            {/* Top Tokens */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Top Tokens</h3>
              <div className="space-y-3">
                {tokens.slice(0, 5).map((token, index) => (
                  <div key={token.symbol} className="flex items-center justify-between p-3 bg-dark-800/30 rounded-lg hover:bg-dark-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{token.logo}</span>
                      <div>
                        <div className="font-medium text-white">{token.symbol}</div>
                        <div className="text-dark-400 text-sm">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">${token.price.toLocaleString()}</div>
                      <div className={`text-sm ${token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {token.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trades */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Popular Pairs</h3>
              <div className="space-y-3">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-dark-800/30 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{trade.pair}</div>
                      <div className="text-dark-400 text-sm">24h Volume: {trade.volume}</div>
                    </div>
                    <div className="text-green-400 text-sm font-medium">{trade.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose GhostSwap?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Best Rates</h3>
              <p className="text-dark-300">
                Advanced routing algorithms find the best prices across multiple DEXs and liquidity sources.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-dark-300">
                Sub-second swaps with optimized smart contracts and efficient transaction batching.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure & Private</h3>
              <p className="text-dark-300">
                Non-custodial swaps with advanced privacy features and audited smart contracts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
