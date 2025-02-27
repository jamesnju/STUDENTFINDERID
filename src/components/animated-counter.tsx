"use client"
import { useEffect, useState, useRef } from "react"
import { useInView } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
}

export function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)

      let startTime: number | null = null
      let animationFrameId: number

      const animate = (timestamp: number) => {
        if (startTime === null) startTime = timestamp
        const progress = timestamp - startTime
        const percentage = Math.min(progress / duration, 1)
        setCount(Math.floor(percentage * value))

        if (percentage < 1) {
          animationFrameId = requestAnimationFrame(animate)
        }
      }

      animationFrameId = requestAnimationFrame(animate)

      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isInView, hasAnimated, duration, value])

  return <div ref={ref}>{count}</div>
}