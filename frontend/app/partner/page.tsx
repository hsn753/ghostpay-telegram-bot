'use client'

import { useState } from 'react'
import { Users, UserCheck, TrendingUp, Globe, ArrowRight, CheckCircle, Star, Building, Code, Zap, Shield, DollarSign } from 'lucide-react'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default function PartnerPage() {
  const [partnerType, setPartnerType] = useState('integration')

  const partnerTypes = [
    {
      id: 'integration',
      name: 'Integration Partners',
      icon: Code,
      description: 'Integrate Ghostware into your platform or application',
      benefits: [
        'Revenue sharing up to 40%',
        'Priority technical support',
        'Co-marketing opportunities',
        'Custom API access'
      ]
    },
    {
      id: 'institutional',
      name: 'Institutional Partners',
      icon: Building,
      description: 'Enterprise-level partnerships and white-label solutions',
      benefits: [
        'White-label licensing',
        'Dedicated infrastructure',
        'Custom compliance solutions',
        'Enterprise SLA guarantees'
      ]
    },
    {
      id: 'liquidity',
      name: 'Liquidity Partners',
      icon: TrendingUp,
      description: 'Provide liquidity and earn competitive yields',
      benefits: [
        'Competitive yield rates',
        'Priority order matching',
        'Reduced trading fees',
        'Market maker incentives'
      ]
    }
  ]

  const existingPartners = [
    { name: 'Solana Foundation', type: 'Blockchain', logo: '◎', status: 'Active' },
    { name: 'Ethereum Foundation', type: 'Blockchain', logo: '◆', status: 'Active' },
    { name: 'Polygon Labs', type: 'Blockchain', logo: '◬', status: 'Active' },
    { name: 'Binance Smart Chain', type: 'Blockchain', logo: '◊', status: 'Active' },
    { name: 'Chainlink', type: 'Oracle', logo: '🔗', status: 'Active' },
    { name: 'The Graph', type: 'Infrastructure', logo: '📊', status: 'Active' }
  ]

  const partnerBenefits = [
    {
      icon: DollarSign,
      title: 'Revenue Sharing',
      description: 'Earn competitive revenue shares from transactions and fees generated through your integration.'
    },
    {
      icon: Zap,
      title: 'Technical Support',
      description: 'Get priority access to our engineering team for integration support and technical assistance.'
    },
    {
      icon: Globe,
      title: 'Market Access',
      description: 'Tap into our 891K+ user base and expand your reach in the crypto payments ecosystem.'
    },
    {
      icon: Shield,
      title: 'Co-Marketing',
      description: 'Joint marketing campaigns, case studies, and promotional opportunities to boost your brand.'
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
            <div className="inline-flex items-center space-x-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-4 py-2 mb-8">
              <UserCheck className="w-4 h-4 text-accent-400" />
              <span className="text-accent-400 text-sm font-medium">Partnership Program</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build the Future <span className="text-accent-400">Together</span>
            </h1>
            <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join our growing network of partners and unlock new revenue opportunities 
              while delivering cutting-edge crypto payment solutions to your users.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-dark-400 mb-12">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>200+ Active Partners</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>40% Revenue Share</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-accent-400" />
                <span>891K+ User Network</span>
              </div>
            </div>

            <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto">
              Apply for Partnership
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Partnership Opportunities</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Choose the partnership model that best fits your business needs and growth objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <div 
                key={type.id}
                className={`card p-8 cursor-pointer transition-all duration-300 ${
                  partnerType === type.id 
                    ? 'border-accent-500 bg-accent-500/5' 
                    : 'hover:border-accent-500/50'
                }`}
                onClick={() => setPartnerType(type.id)}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-accent-500/10 rounded-xl">
                    <type.icon className="w-8 h-8 text-accent-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{type.name}</h3>
                </div>
                
                <p className="text-dark-300 mb-6 leading-relaxed">{type.description}</p>
                
                <div className="space-y-3">
                  {type.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-dark-200 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-dark-800">
                  <button className="w-full bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 py-3 rounded-lg font-medium transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-20 bg-dark-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Partner Benefits</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Access exclusive benefits and resources designed to help your business grow and succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerBenefits.map((benefit, index) => (
              <div key={index} className="card text-center group hover:border-accent-500/30">
                <div className="p-4 bg-accent-500/10 rounded-xl w-fit mx-auto mb-4 group-hover:bg-accent-500/20 transition-colors">
                  <benefit.icon className="w-8 h-8 text-accent-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-dark-300 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Partners */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Partners</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Join a growing ecosystem of leading blockchain projects, platforms, and service providers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {existingPartners.map((partner, index) => (
              <div key={index} className="card text-center group hover:border-accent-500/30">
                <div className="text-4xl mb-3">{partner.logo}</div>
                <div className="font-semibold text-white mb-1 text-sm">{partner.name}</div>
                <div className="text-dark-400 text-xs mb-2">{partner.type}</div>
                <div className="text-green-400 text-xs">{partner.status}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-6 py-3">
              <Users className="w-5 h-5 text-accent-400" />
              <span className="text-accent-400 font-medium">200+ partners and growing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-dark-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How to Become a Partner</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Our streamlined application process gets you up and running quickly with dedicated support every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Apply</h3>
              <p className="text-dark-300 text-sm">Submit your partnership application with your business details and integration plans.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Review</h3>
              <p className="text-dark-300 text-sm">Our team reviews your application and schedules a consultation call within 48 hours.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Integrate</h3>
              <p className="text-dark-300 text-sm">Get access to our APIs, documentation, and technical support for seamless integration.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-400">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Launch</h3>
              <p className="text-dark-300 text-sm">Go live with Ghostware integration and start earning revenue from day one.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="card bg-gradient-to-r from-accent-500/10 to-accent-400/5 text-center p-12">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Partner with Ghostware?</h2>
            <p className="text-dark-300 text-lg mb-8 max-w-2xl mx-auto">
              Join our ecosystem and unlock new revenue opportunities while delivering 
              best-in-class crypto payment solutions to your users.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Apply Now
              </button>
              <button className="border border-accent-500/50 hover:border-accent-500 text-accent-400 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Download Partnership Guide
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-dark-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No upfront fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>24/7 technical support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Revenue sharing from day one</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="bg-dark-900/50 border-t border-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-white mb-1">Partnership Inquiries</div>
                  <div className="text-dark-400">partnerships@ghostware.com</div>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Technical Support</div>
                  <div className="text-dark-400">developers@ghostware.com</div>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Business Development</div>
                  <div className="text-dark-400">business@ghostware.com</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Partnership Resources</h3>
              <div className="space-y-2">
                <a href="#" className="text-dark-400 hover:text-white transition-colors block">API Documentation</a>
                <a href="#" className="text-dark-400 hover:text-white transition-colors block">Integration Guides</a>
                <a href="#" className="text-dark-400 hover:text-white transition-colors block">Partner Portal</a>
                <a href="#" className="text-dark-400 hover:text-white transition-colors block">Revenue Calculator</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dark-800 mt-12 pt-8 text-center text-dark-400">
            <p>&copy; 2024 Ghostware. All rights reserved. Building partnerships for the decentralized future.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
