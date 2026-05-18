'use client'

import { useState } from 'react'
import { Send, QrCode, Copy, Shield, Zap, Globe, CheckCircle, ArrowRight, Wallet, CreditCard } from 'lucide-react'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('send')
  const [selectedToken, setSelectedToken] = useState('SOL')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [showQR, setShowQR] = useState(false)

  const tokens = [
    { symbol: 'SOL', name: 'Solana', balance: 12.45, logo: '◎' },
    { symbol: 'USDC', name: 'USD Coin', balance: 1234.56, logo: '○' },
    { symbol: 'USDT', name: 'Tether', balance: 890.12, logo: '◈' },
    { symbol: 'ETH', name: 'Ethereum', balance: 2.34, logo: '◆' },
  ]

  const recentTransactions = [
    { id: '1', type: 'sent', amount: '5.2 SOL', to: '7xK...9mL', status: 'completed', time: '2 mins ago' },
    { id: '2', type: 'received', amount: '150 USDC', from: '9pQ...3nF', status: 'completed', time: '15 mins ago' },
    { id: '3', type: 'sent', amount: '0.8 ETH', to: '4hR...8kJ', status: 'pending', time: '1 hour ago' },
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
            <h1 className="text-4xl font-bold text-white mb-4">GhostPay</h1>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Send and receive crypto payments instantly with complete privacy across multiple blockchain networks.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Interface */}
          <div className="lg:col-span-2">
            <div className="card">
              {/* Payment Method Tabs */}
              <div className="flex border-b border-dark-800 mb-6">
                <button
                  onClick={() => setPaymentMethod('send')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    paymentMethod === 'send' 
                      ? 'text-accent-400 border-b-2 border-accent-400' 
                      : 'text-dark-400 hover:text-white'
                  }`}
                >
                  Send Payment
                </button>
                <button
                  onClick={() => setPaymentMethod('receive')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    paymentMethod === 'receive' 
                      ? 'text-accent-400 border-b-2 border-accent-400' 
                      : 'text-dark-400 hover:text-white'
                  }`}
                >
                  Receive Payment
                </button>
                <button
                  onClick={() => setPaymentMethod('request')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    paymentMethod === 'request' 
                      ? 'text-accent-400 border-b-2 border-accent-400' 
                      : 'text-dark-400 hover:text-white'
                  }`}
                >
                  Request Payment
                </button>
              </div>

              {paymentMethod === 'send' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Send Crypto Payment</h2>
                  
                  {/* Token Selection */}
                  <div>
                    <label className="block text-dark-400 text-sm mb-2">Select Token</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {tokens.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => setSelectedToken(token.symbol)}
                          className={`p-4 rounded-lg border transition-colors ${
                            selectedToken === token.symbol
                              ? 'border-accent-500 bg-accent-500/10'
                              : 'border-dark-700 hover:border-dark-600 bg-dark-800/30'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{token.logo}</div>
                            <div className="font-medium text-white">{token.symbol}</div>
                            <div className="text-dark-400 text-sm">{token.balance}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-dark-400 text-sm mb-2">Amount</label>
                    <div className="bg-dark-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="bg-transparent text-2xl font-semibold text-white placeholder-dark-500 flex-1 outline-none"
                        />
                        <div className="text-white font-medium">{selectedToken}</div>
                      </div>
                      <div className="text-right text-dark-400 text-sm mt-2">≈ $1,230.45 USD</div>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div>
                    <label className="block text-dark-400 text-sm mb-2">Recipient Address</label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Enter wallet address or ENS name"
                      className="w-full bg-dark-800/50 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-accent-500"
                    />
                  </div>

                  {/* Privacy Options */}
                  <div className="bg-dark-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">Privacy Settings</span>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-accent-400" />
                        <span className="text-accent-400 text-sm">Enhanced Privacy</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-dark-300">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Transaction mixing enabled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>IP address masking active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Stealth address generation</span>
                      </div>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Payment</span>
                  </button>
                </div>
              )}

              {paymentMethod === 'receive' && (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-bold text-white">Receive Payment</h2>
                  
                  <div className="bg-dark-800/30 rounded-lg p-8">
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-dark-900" />
                    </div>
                    <p className="text-dark-300 mb-4">Scan QR code to send payment</p>
                  </div>

                  <div>
                    <label className="block text-dark-400 text-sm mb-2">Your Wallet Address</label>
                    <div className="flex items-center space-x-3 bg-dark-800/50 rounded-lg p-4">
                      <code className="flex-1 text-white font-mono">7xKpQ9mL3nF8kJ2hR5wE1pC6vB4yN9xM7gT3dA8sZ5uY</code>
                      <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                        <Copy className="w-4 h-4 text-accent-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {tokens.map((token) => (
                      <div key={token.symbol} className="bg-dark-800/30 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">{token.logo}</div>
                        <div className="font-medium text-white">{token.symbol}</div>
                        <div className="text-accent-400 text-sm">Available</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'request' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Request Payment</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-dark-400 text-sm mb-2">Amount</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-dark-800/50 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-accent-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-dark-400 text-sm mb-2">Token</label>
                      <select className="w-full bg-dark-800/50 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-500">
                        {tokens.map((token) => (
                          <option key={token.symbol} value={token.symbol}>
                            {token.symbol} - {token.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-dark-400 text-sm mb-2">Description (Optional)</label>
                    <input
                      type="text"
                      placeholder="What is this payment for?"
                      className="w-full bg-dark-800/50 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-accent-500"
                    />
                  </div>

                  <button className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors">
                    Generate Payment Request
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Balance */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Wallet Balance</h3>
              <div className="space-y-3">
                {tokens.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between p-3 bg-dark-800/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{token.logo}</span>
                      <div>
                        <div className="font-medium text-white">{token.symbol}</div>
                        <div className="text-dark-400 text-sm">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">{token.balance}</div>
                      <div className="text-dark-400 text-sm">≈ $1,230</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-dark-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${tx.type === 'sent' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                          {tx.type === 'sent' ? 
                            <Send className="w-3 h-3 text-red-400" /> :
                            <ArrowRight className="w-3 h-3 text-green-400 rotate-180" />
                          }
                        </div>
                        <span className="font-medium text-white capitalize">{tx.type}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-sm text-dark-300">
                      <div>{tx.amount}</div>
                      <div>{tx.type === 'sent' ? `To: ${tx.to}` : `From: ${tx.from}`}</div>
                      <div className="text-dark-500">{tx.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Features */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-dark-300">End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-dark-300">Instant settlements</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span className="text-dark-300">Global accessibility</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-dark-300">Non-custodial</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose GhostPay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Privacy First</h3>
              <p className="text-dark-300">
                Advanced privacy protocols ensure your transactions remain completely anonymous and untraceable.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Payments</h3>
              <p className="text-dark-300">
                Send and receive payments in seconds with optimized smart contracts and efficient routing.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-4">
                <Globe className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Chain</h3>
              <p className="text-dark-300">
                Works across 12+ blockchain networks including Solana, Ethereum, Polygon, and more.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
