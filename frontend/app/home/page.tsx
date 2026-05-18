'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, Globe, Users, TrendingUp, Star, Play, CheckCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

interface AssetVolume {
  totalVolumeLamports: string
  transactionCount: number
}

interface ComprehensiveMetrics {
  totalTransactions: number
  assetVolumes: {
    [key: string]: AssetVolume
  }
  productMetrics: {
    ghostPay: { transactions: number }
    ghostSwap: { transactions: number }
    ghostSend: { transactions: number }
  }
  dateFilter: string
}

interface Stats {
  totalTransactions: number
  totalVolume: number
  totalWallets: number
  newWallets: number
  sol: number
  usdt: number
  usdc: number
  usd1: number
  usdcSol: number
  eth: number
  ghostPayTxs: number
  ghostSwapTxs: number
  ghostSendTxs: number
}

interface Transaction {
  id: number
  payerAddress: string | null
  depositAddress: string
  receiverAddress: string | null
  houdiniId: string
  amountLamports: string | null
  asset: string | null
  productType: string
  createdAt: string
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalTransactions: 0,
    totalVolume: 0,
    totalWallets: 0,
    newWallets: 0,
    sol: 0,
    usdt: 0,
    usdc: 0,
    usd1: 0,
    usdcSol: 0,
    eth: 0,
    ghostPayTxs: 0,
    ghostSwapTxs: 0,
    ghostSendTxs: 0
  })
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingTxs, setLoadingTxs] = useState(true)
  const [selectedDays, setSelectedDays] = useState<number | null>(null)
  const [dateLabel, setDateLabel] = useState('All time')

  useEffect(() => {
    fetchMetrics(selectedDays)
    fetchRecentTransactions()
  }, [selectedDays])

  const fetchMetrics = async (days: number | null) => {
    try {
      const url = days 
        ? `https://api2.ghostwareos.com/api/volume/metrics?days=${days}`
        : 'https://api2.ghostwareos.com/api/volume/metrics'
      
      const response = await fetch(url)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const data = result.data
          
          // Aggregate volumes across all transaction types from volumeByType
          let solVol = 0, usdtVol = 0, usdcVol = 0, usd1Vol = 0, usdcSolVol = 0, ethVol = 0
          
          // Extract from volumeByType (new structure)
          Object.keys(data.volumeByType || {}).forEach(txType => {
            const volumes = data.volumeByType[txType]
            solVol += parseFloat(volumes?.SOL || 0)
            usdtVol += parseFloat(volumes?.USDT || 0)
            usdcVol += parseFloat(volumes?.USDC || 0)
            usd1Vol += parseFloat(volumes?.USD1 || 0)
            usdcSolVol += parseFloat(volumes?.USDCSOL || 0)
            ethVol += parseFloat(volumes?.ETH || 0)
          })
          
          // Use actual USD volume from API
          const totalVol = data.totalUsdVolume || 0
          
          setStats({
            totalTransactions: data.totalTransactions || 0,
            totalVolume: totalVol,
            totalWallets: data.userMetrics?.totalUsers || 0,
            newWallets: data.userMetrics?.newUsers || 0,
            sol: solVol,
            usdt: usdtVol,
            usdc: usdcVol,
            usd1: usd1Vol,
            usdcSol: usdcSolVol,
            eth: ethVol,
            ghostPayTxs: data.transactionsByType?.PAYMENT || 0,
            ghostSwapTxs: data.transactionsByType?.SWAP || 0,
            ghostSendTxs: data.transactionsByType?.SEND || 0
          })
          setDateLabel(data.dateFilter || 'All time')
        }
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }
  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Advanced privacy protocols protect your transactions and identity across all networks.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-second transaction speeds with 99.9% success rate across 12+ blockchain networks.'
    },
    {
      icon: Globe,
      title: 'Multi-Chain',
      description: 'Seamlessly operate across Solana, Ethereum, Polygon, and more blockchain ecosystems.'
    }
  ]

  const pieData = [
    { name: 'GhostPay', value: stats.ghostPayTxs, color: '#00d9ff' },
    { name: 'GhostSwap', value: stats.ghostSwapTxs, color: '#10b981' },
    { name: 'GhostSend', value: stats.ghostSendTxs, color: '#f59e0b' }
  ]

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const formatAssetVolume = (vol: number, decimals: number = 2) => {
    return vol > 0 ? vol.toFixed(decimals) : '0'
  }

  const maskAddress = (address: string | null) => {
    if (!address) return 'N/A'
    if (address.length < 10) return address
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const formatAmount = (amountLamports: string | null, asset: string | null, productType: string) => {
    if (!amountLamports || !asset) {
      return productType === 'ghostpay' ? 'N/A' : 'Swap/Send'
    }
    // API returns actual values in base units already (not lamports)
    const amount = parseFloat(amountLamports)
    return `${amount.toFixed(4)} ${asset}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const fetchRecentTransactions = async () => {
    try {
      setLoadingTxs(true)
      // Recent transactions endpoint not available in production yet
      // Setting empty array for now
      setRecentTransactions([])
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error)
    } finally {
      setLoadingTxs(false)
    }
  }

  const dateFilters = [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: '180D', days: 180 },
    { label: 'All', days: null }
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <CursorTracker />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 via-transparent to-accent-400/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              GhostWare <span className="text-accent-500">Dashboard</span>
            </h1>
            
            <p className="text-lg text-dark-300 mb-6 max-w-2xl mx-auto">
              Real-time analytics for your crypto payment infrastructure
            </p>

            {/* Date Filter */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <span className="text-dark-300 text-sm mr-2">{dateLabel}</span>
              {dateFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => setSelectedDays(filter.days)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDays === filter.days
                      ? 'bg-accent-500 text-black'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Key Metrics */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-accent-500 mb-3">
                      {loading ? '...' : `$${formatNumber(Math.round(stats.totalVolume))}`}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">Total Volume Processed</div>
                  </div>
                </div>
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-accent-500 mb-3">
                      {loading ? '...' : formatNumber(stats.totalTransactions)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">Total Transactions</div>
                  </div>
                </div>
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-accent-500 mb-3">
                      {loading ? '...' : formatNumber(stats.totalWallets)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">Total Wallets</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Per-Product Metrics */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Transactions by Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-500 mb-2">
                      {loading ? '...' : formatNumber(stats.ghostPayTxs)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">GhostPay</div>
                  </div>
                </div>
                <div className="card hover:border-success/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">
                      {loading ? '...' : formatNumber(stats.ghostSwapTxs)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">GhostSwap</div>
                  </div>
                </div>
                <div className="card hover:border-warning/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">
                      {loading ? '...' : formatNumber(stats.ghostSendTxs)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">GhostSend</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Per-Asset Volumes */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Volume by Asset</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-500 mb-2">
                      {loading ? '...' : formatAssetVolume(stats.sol)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">SOL</div>
                  </div>
                </div>
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-500 mb-2">
                      {loading ? '...' : formatAssetVolume(stats.usdt)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">USDT</div>
                  </div>
                </div>
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-500 mb-2">
                      {loading ? '...' : formatAssetVolume(stats.usdc)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">USDC</div>
                  </div>
                </div>
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-500 mb-2">
                      {loading ? '...' : formatAssetVolume(stats.usd1)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">USD1</div>
                  </div>
                </div>
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-500 mb-2">
                      {loading ? '...' : formatAssetVolume(stats.eth)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">ETH</div>
                  </div>
                </div>
                <div className="card hover:border-accent-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-500 mb-2">
                      {loading ? '...' : formatAssetVolume(stats.usdcSol)}
                    </div>
                    <div className="text-dark-300 text-sm uppercase tracking-wider">USDCSOL</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie Chart Section - Under Metrics */}
            {!loading && stats.totalTransactions > 0 && (
              <div className="mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                  {/* Pie Chart */}
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-6">Transaction Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="42%"
                          labelLine={false}
                          label={false}
                          outerRadius={95}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155', 
                            borderRadius: '8px',
                            padding: '8px 12px'
                          }}
                          itemStyle={{ color: '#ffffff' }}
                          labelStyle={{ color: '#ffffff' }}
                          formatter={(value: number, name: string) => [`${value} txs`, name]}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          wrapperStyle={{ color: '#94a3b8', paddingTop: '20px' }}
                          formatter={(value, entry: any) => `${value}: ${entry.payload.value} txs`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recent Transactions */}
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                    <div className="space-y-3">
                      {loadingTxs ? (
                        <div className="text-center text-dark-300 py-8">Loading...</div>
                      ) : recentTransactions.length === 0 ? (
                        <div className="text-center text-dark-300 py-8">No transactions yet</div>
                      ) : (
                        recentTransactions.map((tx) => (
                          <div key={tx.id} className="p-3 bg-dark-800/30 rounded-lg border border-dark-700/40 hover:border-accent-500/30 transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-accent-500/10 rounded-lg flex items-center justify-center">
                                  <Zap className="w-4 h-4 text-accent-500" />
                                </div>
                                <div>
                                  <span className="text-white font-medium text-sm capitalize block">{tx.productType}</span>
                                  <span className="text-dark-400 text-xs">{formatDate(tx.createdAt)}</span>
                                </div>
                              </div>
                              <span className="text-success text-xs font-semibold px-2 py-1 bg-success/10 rounded-full">Completed</span>
                            </div>
                            <div className="text-dark-300 text-xs space-y-1">
                              {tx.payerAddress && (
                                <div className="flex justify-between">
                                  <span>From:</span>
                                  <span className="text-white font-mono">{maskAddress(tx.payerAddress)}</span>
                                </div>
                              )}
                              {tx.receiverAddress && (
                                <div className="flex justify-between">
                                  <span>To:</span>
                                  <span className="text-white font-mono">{maskAddress(tx.receiverAddress)}</span>
                                </div>
                              )}
                              {tx.depositAddress && (
                                <div className="flex justify-between">
                                  <span>Deposit:</span>
                                  <span className="text-white font-mono">{maskAddress(tx.depositAddress)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="text-accent-500 font-medium">{formatAmount(tx.amountLamports, tx.asset, tx.productType)}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      
                      <div className="text-center pt-2">
                        <Link href="/analytics" className="text-accent-500 hover:text-accent-400 text-sm font-semibold transition-colors">
                          View All Transactions →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose Ghostware?</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Built for the future of finance, designed for today's needs. Experience the power of decentralized payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:border-accent-500/30 transition-all duration-300">
                <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-6 group-hover:bg-accent-500/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-accent-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-dark-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Product Ecosystem</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Comprehensive suite of tools for every aspect of crypto payments and DeFi operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* GhostPay */}
            <div className="card group hover:border-accent-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">GhostPay</h3>
              </div>
              <p className="text-dark-300 mb-6 leading-relaxed">
                Instant, private payments across multiple blockchains. Send and receive crypto with complete anonymity.
              </p>
              <Link 
                href="/payment" 
                className="text-accent-400 hover:text-accent-300 font-medium flex items-center group"
              >
                Learn More 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* GhostSwap */}
            <div className="card group hover:border-accent-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">GhostSwap</h3>
              </div>
              <p className="text-dark-300 mb-6 leading-relaxed">
                Decentralized exchange with the best rates and liquidity across all major cryptocurrencies.
              </p>
              <Link 
                href="/swap" 
                className="text-accent-400 hover:text-accent-300 font-medium flex items-center group"
              >
                Start Trading 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* GhostSend */}
            <div className="card group hover:border-accent-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">GhostSend</h3>
              </div>
              <p className="text-dark-300 mb-6 leading-relaxed">
                Bulk payments and automated distributions for businesses, DAOs, and crypto projects.
              </p>
              <a 
                href="https://app.ghostwareos.com/ghostsend" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-400 hover:text-accent-300 font-medium flex items-center group"
              >
                Explore Tools 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent-500/10 to-accent-400/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-dark-300 text-lg mb-12 max-w-2xl mx-auto">
            Join 891K+ users who trust Ghostware for their crypto payment needs. Experience the future of DeFi today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="https://app.ghostwareos.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Launch Ghostware
            </a>
          </div>

          <div className="flex items-center justify-center space-x-8 mt-12 text-sm text-dark-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>No KYC Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Non-Custodial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900/50 border-t border-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Ghostware</span>
              </div>
              <p className="text-dark-400 mb-6 max-w-md">
                The future of crypto payments. Privacy-first, lightning-fast, multi-chain infrastructure for the decentralized world.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <div className="space-y-2">
                <a href="https://app.ghostwareos.com/" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-white transition-colors block">GhostPay</a>
                <a href="https://app.ghostwareos.com/ghostswap" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-white transition-colors block">GhostSwap</a>
                <a href="https://app.ghostwareos.com/ghostsend" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-white transition-colors block">GhostSend</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="text-dark-400 hover:text-white transition-colors block">Documentation</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dark-800 mt-12 pt-8 text-center text-dark-400">
            <p>&copy; 2024 Ghostware. All rights reserved. Built for the decentralized future.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
