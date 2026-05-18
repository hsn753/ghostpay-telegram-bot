'use client'

import { useEffect, useState } from 'react'

interface AnimatedCounterProps {
  value: number | string
  duration?: number
  formatValue?: (val: number) => string
}

export function AnimatedCounter({ value, duration = 2000, formatValue }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    if (typeof value === 'string') {
      return
    }
    
    const startValue = 0
    const endValue = value
    const startTime = Date.now()
    
    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = startValue + (endValue - startValue) * easeOutQuart
      
      setDisplayValue(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [value, duration])
  
  if (typeof value === 'string') {
    return <>{value}</>
  }
  
  return <>{formatValue ? formatValue(displayValue) : Math.round(displayValue)}</>
}
