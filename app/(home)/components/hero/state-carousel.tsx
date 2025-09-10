'use client'
//https://www.scrollxui.dev/docs/components/statscarousel
import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface StatItem {
  id?: number
  value: number
  suffix?: string
  label: string
}

function StatsCarousel({
  value,
  suffix,
  trigger,
  onDone,
}: {
  value: number
  suffix?: string
  trigger: number
  onDone: () => void
}) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 20,
    stiffness: 50,
    mass: 1,
  })
  const rounded = useTransform(springValue, (latest) =>
    Number(latest.toFixed(value % 1 === 0 ? 0 : 1))
  )
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    motionValue.set(0)
    const unsub = rounded.on('change', (v) => {
      setDisplayValue(v)
      if (v >= value) onDone?.()
    })
    const timeout = setTimeout(() => {
      motionValue.set(value)
    }, 100)
    return () => {
      unsub()
      clearTimeout(timeout)
    }
  }, [trigger, value, motionValue, rounded, onDone])

  return (
    <div className="text-2xl font-extrabold text-red-300  ">
      {displayValue}
      {suffix}
    </div>
  )
}

export default function StatsCarouselcount({
  stats,
  //   title,
  className = '',
  cardClassName = '',
}: {
  stats?: StatItem[]
  title?: string
  className?: string
  cardClassName?: string
}) {
  const defaultStats: StatItem[] = [
    { value: 50, suffix: '+', label: 'Components' },
    { value: 12, suffix: 'K+', label: 'Developers' },
    { value: 99, suffix: '%', label: 'Performance' },
  ]

  const initialStats = (stats ?? defaultStats).map((s, i) => ({
    ...s,
    id: i + 1,
  }))
  const [items, setItems] = useState(initialStats)
  const [phase, setPhase] = useState<'idle' | 'down' | 'stackUp' | 'upReenter'>(
    'idle'
  )
  const [activeTopId, setActiveTopId] = useState(initialStats[0].id!)
  const [triggerCounter, setTriggerCounter] = useState(0)
  const [animatedIds, setAnimatedIds] = useState<Set<number>>(new Set())
  const [resetQueue, setResetQueue] = useState<Set<number>>(new Set())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (phase === 'idle')
      timeoutRef.current = setTimeout(() => setPhase('down'), 3000)
    if (phase === 'down')
      timeoutRef.current = setTimeout(() => setPhase('stackUp'), 600)
    if (phase === 'stackUp')
      timeoutRef.current = setTimeout(() => setPhase('upReenter'), 600)
    if (phase === 'upReenter') {
      timeoutRef.current = setTimeout(() => {
        setItems((prev) => {
          const [first, ...rest] = prev
          const newTopId = rest[0].id!

          setResetQueue((r) => {
            const newSet = new Set(r)
            newSet.add(first.id!)
            return newSet
          })

          setAnimatedIds((prev) => {
            const copy = new Set(prev)
            copy.delete(first.id!)
            return copy
          })

          setActiveTopId(newTopId)
          setTriggerCounter((t) => t + 1)

          return [...rest, first]
        })

        setPhase('idle')
      }, 600)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [phase])

  return (
    <section
      className={`py-20 px-4 w-full max-w-md mx-auto text-center relative h-fit z-[2] ${className}`}
    >
      {/* <h2 className="text-lg font-bold text-black dark:text-white mb-12">
        {title ?? 'CREATE STUNNING INTERFACES WITH SCROLLX UI COMPONENTS'}
      </h2> */}
      <div className="relative h-[300px]">
        {items.map((stat, index) => {
          const baseY = index * 20
          const scale = 1 - index * 0.05
          const isTopCard = index === 0
          const bottomIndex = items.length - 1
          const bottomScale = 1 - bottomIndex * 0.05

          let animate = { x: 0, y: baseY, scale }
          if (isTopCard && phase === 'down')
            animate = { x: 0, y: baseY + 100, scale: 0.8 }
          if (!isTopCard && phase === 'stackUp')
            animate = { x: 0, y: baseY - 20, scale }
          if (isTopCard && phase === 'stackUp')
            animate = { x: 0, y: baseY + 100, scale: 0.8 }
          if (isTopCard && phase === 'upReenter')
            animate = { x: 0, y: bottomIndex * 20, scale: bottomScale }

          const zIndex =
            phase === 'upReenter' && isTopCard
              ? 0
              : Math.max(0, Math.min(40, 40 - index))
          const shouldAnimate =
            stat.id === activeTopId &&
            phase === 'idle' &&
            !animatedIds.has(stat.id!)
          const shouldShowZero =
            resetQueue.has(stat.id!) && stat.id !== activeTopId

          return (
            <motion.div
              key={stat.id}
              className="absolute left-0 right-0 mx-auto w-full "
              style={{ zIndex }}
              animate={animate}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <div
                className={`flex flex-col items-center justify-center rounded-xl border border-white/20 p-2 bg-white/10 backdrop-blur-md   shadow-lg ${cardClassName}`}
              >
                {shouldAnimate ? (
                  <StatsCarousel
                    value={stat.value}
                    suffix={stat.suffix}
                    trigger={triggerCounter}
                    onDone={() =>
                      setAnimatedIds((prev) => new Set(prev).add(stat.id!))
                    }
                  />
                ) : shouldShowZero ? (
                  <div className="text-2xl font-extrabold text-red-500 ">
                    0{stat.suffix}
                  </div>
                ) : (
                  <div className="text-2xl font-extrabold text-red-500 ">
                    {stat.value}
                    {stat.suffix}
                  </div>
                )}
                <p className="text-xs text-amber-500   mt-1 text-center uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
