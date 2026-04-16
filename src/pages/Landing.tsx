import { useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

const CITIES = [
  { name: 'London',  region: 'England',      currency: 'GBP', to: '/london' },
  { name: 'Basel',   region: 'Switzerland',  currency: 'CHF', to: '/basel'  },
  { name: 'Zurich',  region: 'Switzerland',  currency: 'CHF', to: '/zurich' },
]

const SPRING = { stiffness: 260, damping: 22, mass: 0.6 }

interface CityRowProps {
  name: string
  region: string
  currency: string
  to: string
  index: number
  hoveredIndex: number | null
  setHoveredIndex: (i: number | null) => void
}

function CityRow({ name, region, currency, to, index, hoveredIndex, setHoveredIndex }: CityRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, SPRING)
  const sy = useSpring(my, SPRING)

  const isThisHovered = hoveredIndex === index
  const isOtherHovered = hoveredIndex !== null && !isThisHovered

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = rowRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.055)
    my.set((e.clientY - (rect.top + rect.height / 2)) * 0.1)
  }, [mx, my])

  const onMouseLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
    setHoveredIndex(null)
  }, [mx, my, setHoveredIndex])

  return (
    /* Entrance animation wrapper — separated from the spring to avoid transform conflict */
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 28,
        delay: 0.52 + index * 0.09,
      }}
    >
      {/* Magnetic spring wrapper */}
      <motion.div
        ref={rowRef}
        style={{ x: sx, y: sy }}
        onMouseMove={onMouseMove}
      >
        <Link
          to={to}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={onMouseLeave}
          className="group flex items-center justify-between border-b border-white/10 py-5 md:py-7 active:transition-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {/* City name */}
          <span
            className="font-headline italic select-none"
            style={{
              fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
              lineHeight: 1,
              color: isThisHovered ? 'var(--color-accent)' : '#fafaf9',
              opacity: isOtherHovered ? 0.32 : 1,
              transform: isThisHovered ? 'translateX(10px)' : 'translateX(0)',
              transition: [
                'color 300ms cubic-bezier(0.25, 1, 0.5, 1)',
                'opacity 220ms cubic-bezier(0.25, 1, 0.5, 1)',
                'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)',
              ].join(', '),
            }}
          >
            {name}
          </span>

          {/* Metadata + arrow */}
          <div
            className="flex items-center gap-4 md:gap-6 shrink-0"
            style={{
              opacity: isOtherHovered ? 0.22 : isThisHovered ? 1 : 0.6,
              transition: 'opacity 220ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            <span className="hidden sm:block text-[10px] font-label uppercase tracking-widest text-stone-400">
              {region} · {currency}
            </span>
            <span
              className="material-symbols-outlined font-light select-none"
              style={{
                fontSize: '20px',
                color: isThisHovered ? 'var(--color-accent)' : '#9ca3af',
                transform: isThisHovered ? 'translateX(5px)' : 'translateX(0)',
                transition: [
                  'color 250ms cubic-bezier(0.25, 1, 0.5, 1)',
                  'transform 250ms cubic-bezier(0.25, 1, 0.5, 1)',
                ].join(', '),
              }}
            >
              arrow_forward
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default function Landing() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="min-h-dvh flex flex-col relative overflow-x-hidden">
      {/* Full-bleed photo background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.jpg"
          alt=""
          fetchPriority="high"
          width={1920}
          height={1280}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply" />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(12,10,9,0.15) 0%, rgba(12,10,9,0.1) 35%, rgba(12,10,9,0.75) 70%, rgba(12,10,9,0.97) 100%)',
          }}
        />
      </div>

      {/* Nav */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 w-full px-8 md:px-12 lg:px-16 pt-7 pb-0 max-w-7xl mx-auto"
      >
        <span className="text-[12px] font-label uppercase tracking-[0.2em] text-stone-300/55 select-none">
          Threshold
        </span>
      </motion.header>

      {/* Main — bottom-anchored; pt-24 guarantees gap below the THRESHOLD label */}
      <main className="relative z-10 flex-grow flex flex-col justify-end px-8 md:px-12 lg:px-16 pt-24 md:pt-32 pb-8 md:pb-10 w-full max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.08 }}
          className="mb-10 md:mb-14"
        >
          {/* Eyebrow tag — editorial precision detail */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="inline-block text-[10px] font-label uppercase tracking-[0.22em] text-accent mb-5 md:mb-7"
          >
            Rental affordability · London · Basel · Zurich
          </motion.span>

          <h1
            className="font-headline text-stone-50 tracking-tight"
            style={{
              fontSize: 'clamp(3.25rem, 9vw, 8.5rem)',
              lineHeight: 0.91,
              letterSpacing: '-0.025em',
            }}
          >
            The real cost of
            <br />
            <span className="italic text-stone-300/90">moving out</span>
            {/* Amber period — the one signature colour moment in the hero */}
            <span className="text-accent">.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="mt-7 md:mt-9 text-sm md:text-base font-body text-stone-400/75 max-w-sm md:max-w-md leading-relaxed"
          >
            Select a city to see exactly what independent living costs — upfront
            and every month.
          </motion.p>
        </motion.div>

        {/* City rows */}
        <div className="border-t border-white/10">
          {CITIES.map((city, i) => (
            <CityRow
              key={city.name}
              {...city}
              index={i}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 w-full flex items-center justify-between px-8 md:px-12 lg:px-16 py-6 max-w-7xl mx-auto"
      >
        <span className="text-base font-headline italic text-stone-50/25">Threshold</span>
        <p className="text-[10px] font-label uppercase tracking-widest text-stone-400/55">
          Cost data last updated per city · Not financial advice
        </p>
      </motion.footer>
    </div>
  )
}
