'use client'

import { useEffect, useState } from 'react'

export default function CursorTracker() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <>
      {/* Main cursor follower */}
      <div
        className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: mousePos.x - 10,
          top: mousePos.y - 10,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-5 h-5 bg-accent-400/30 rounded-full animate-ping" />
      </div>

      {/* Secondary trail effect */}
      <div
        className={`fixed pointer-events-none z-40 transition-all duration-500 ${
          isVisible ? 'opacity-60' : 'opacity-0'
        }`}
        style={{
          left: mousePos.x - 15,
          top: mousePos.y - 15,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-8 h-8 border border-accent-400/20 rounded-full" />
      </div>

      {/* Gradient background effect */}
      <div
        className="fixed pointer-events-none z-30 transition-all duration-700 opacity-10"
        style={{
          background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(14, 165, 233, 0.1), transparent)`,
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
        }}
      />
    </>
  )
}
