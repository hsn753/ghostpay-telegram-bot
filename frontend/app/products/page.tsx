'use client'

import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, Users, Shield, Globe, Code, Layers, BarChart3, CheckCircle } from 'lucide-react'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default function ProductsPage() {
  const products = [
    {
      name: 'GhostPay',
      icon: Zap,
      tagline: 'Instant Private Payments',
      description: 'Send and receive cryptocurrency payments with complete privacy and sub-second speeds.',
      features: [
        'Privacy-first transactions',
        'Sub-second settlement',
        'Multi-chain support',
        'Stealth addresses'
      ],
      stats: { users: '450K+', volume: '$89M+', networks: '12+' },
      color: 'blue',
      href: '/payment'
    },
    {
      name: 'GhostSwap',
      icon: TrendingUp,
      tagline: 'Best Rate DEX Aggregator',
      description: 'Trade cryptocurrencies with the deepest liquidity and best rates across multiple exchanges.',
      features: [
        'Best price routing',
        'Deep liquidity pools',
        'Advanced trading tools',
        'MEV protection'
      ],
      stats: { pairs: '247+', volume: '$156M+', savings: '12.3%' },
      color: 'green',
      href: '/swap'
    },
    {
      name: 'GhostSend',
      icon: Users,
      tagline: 'Bulk Payment Solutions',
      description: 'Automate mass payments for businesses, DAOs, and crypto projects with advanced distribution tools.',
      features: [
        'Batch transactions',
        'Smart distribution',
        'CSV import/export',
        'Scheduling & automation'
      ],
      stats: { batches: '12K+', recipients: '89K+', saved: '$234K+' },
      color: 'purple',
      href: '#'
    }
  ]

  const integrations = [
    { name: 'Solana', logo: '◎', status: 'Active' },
    { name: 'Ethereum', logo: '◆', status: 'Active' },
    { name: 'Polygon', logo: '◬', status: 'Active' },
    { name: 'BSC', logo: '◊', status: 'Active' },
    { name: 'Avalanche', logo: '▲', status: 'Active' },
    { name: 'Arbitrum', logo: '◐', status: 'Active' }
  ]

  const developers = [
    {
      title: 'REST APIs',
      description: 'Comprehensive APIs for all Ghostware products',
      icon: Code
    },
    {
      title: 'SDKs',
      description: 'JavaScript, Python, Rust, and Go libraries',
      icon: Layers
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time metrics and transaction monitoring',
      icon: BarChart3
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <CursorTracker />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-accent-400/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Complete <span className="text-accent-400">Crypto Payment</span> Suite
            </h1>
            <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Everything you need for crypto payments, trading, and DeFi operations. 
              Built for privacy, speed, and scale across multiple blockchain networks.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-dark-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>891K+ Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>$356M+ Volume Processed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>12+ Blockchain Networks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const colorClasses = {
                blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
                green: 'from-green-500/20 to-green-600/10 border-green-500/30',
                purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30'
              }
              
              return (
                <div 
                  key={product.name} 
                  className={`relative p-8 rounded-2xl border bg-gradient-to-br hover:scale-105 transition-all duration-300 ${colorClasses[product.color as keyof typeof colorClasses]}`}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-3 rounded-xl ${
                      product.color === 'blue' ? 'bg-blue-500/20' :
                      product.color === 'green' ? 'bg-green-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      <product.icon className={`w-8 h-8 ${
                        product.color === 'blue' ? 'text-blue-400' :
                        product.color === 'green' ? 'text-green-400' :
                        'text-purple-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                      <p className={`text-sm font-medium ${
                        product.color === 'blue' ? 'text-blue-400' :
                        product.color === 'green' ? 'text-green-400' :
                        'text-purple-400'
                      }`}>
                        {product.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-dark-300 mb-6 leading-relaxed">{product.description}</p>

                  <div className="space-y-3 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-dark-200">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-dark-900/30 rounded-lg">
                    {Object.entries(product.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="font-bold text-white">{value}</div>
                        <div className="text-dark-400 text-xs capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href={product.href}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                      product.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                      product.color === 'green' ? 'bg-green-500 hover:bg-green-600 text-white' :
                      'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    Explore {product.name}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-dark-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Multi-Chain Infrastructure</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Built to work seamlessly across all major blockchain networks with unified APIs and consistent user experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {integrations.map((network, index) => (
              <div key={index} className="card text-center group hover:border-accent-500/30">
                <div className="text-4xl mb-3">{network.logo}</div>
                <div className="font-semibold text-white mb-2">{network.name}</div>
                <div className="text-green-400 text-sm">{network.status}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-6 py-3">
              <Globe className="w-5 h-5 text-accent-400" />
              <span className="text-accent-400 font-medium">More networks coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Built for Developers</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Comprehensive tools, SDKs, and APIs to integrate Ghostware into your applications and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {developers.map((tool, index) => (
              <div key={index} className="card text-center group hover:border-accent-500/30">
                <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-4">
                  <tool.icon className="w-8 h-8 text-accent-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{tool.title}</h3>
                <p className="text-dark-300">{tool.description}</p>
              </div>
            ))}
          </div>

          <div className="card bg-gradient-to-r from-accent-500/10 to-accent-400/5 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Build?</h3>
            <p className="text-dark-300 mb-6 max-w-2xl mx-auto">
              Get started with our comprehensive documentation, code examples, and developer tools. 
              Join our developer community and build the future of DeFi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by the Crypto Community</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-400 mb-2">891K+</div>
              <div className="text-dark-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-400 mb-2">$356M+</div>
              <div className="text-dark-400">Volume Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-400 mb-2">4.1M+</div>
              <div className="text-dark-400">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-400 mb-2">99.9%</div>
              <div className="text-dark-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Experience the Future of Crypto Payments</h2>
          <p className="text-dark-300 text-lg mb-8 max-w-2xl mx-auto">
            Join 891K+ users who trust Ghostware for their crypto payment needs. Start with any product and scale as you grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/payment"
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
            >
              Start with GhostPay
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/analytics"
              className="border border-dark-600 hover:border-accent-500/50 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
