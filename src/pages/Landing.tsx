import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CITIES = [
  { name: 'London',  region: 'England',      currency: 'GBP', to: '/london' },
  { name: 'Basel',   region: 'Switzerland',  currency: 'CHF', to: '/basel'  },
  { name: 'Zurich',  region: 'Switzerland',  currency: 'CHF', to: '/zurich' },
]

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
  const isThisHovered = hoveredIndex === index
  const isOtherHovered = hoveredIndex !== null && !isThisHovered

  return (
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
      <Link
        to={to}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        className="group flex items-center justify-between border-b border-white/10 py-5 md:py-7 active:transition-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* City name */}
        <span
          className="font-headline italic select-none"
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
            lineHeight: 1,
            color: '#fafaf9',
            opacity: isOtherHovered ? 0.38 : 1,
            transform: isThisHovered ? 'translateX(10px)' : 'translateX(0)',
            transition: [
              'opacity 220ms cubic-bezier(0.25, 1, 0.5, 1)',
              'transform 280ms cubic-bezier(0.25, 1, 0.5, 1)',
            ].join(', '),
          }}
        >
          {name}
        </span>

        {/* Metadata + arrow */}
        <div
          className="flex items-center gap-4 md:gap-6 shrink-0"
          style={{
            opacity: isOtherHovered ? 0.28 : isThisHovered ? 1 : 0.7,
            transition: 'opacity 220ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          <span className="hidden sm:block text-[10px] font-label uppercase tracking-widest text-stone-400">
            {region} · {currency}
          </span>
          <span
            className="material-symbols-outlined font-light select-none text-stone-300"
            style={{
              fontSize: '20px',
              transform: isThisHovered ? 'translateX(5px)' : 'translateX(0)',
              transition: 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            arrow_forward
          </span>
        </div>
      </Link>
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
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe_MMdhrexQ3QYWfC1riD9Wu6yJxcnV6Emky2zT77YFWB-8yEF1hJLiFHIN7EkIoPvETreNDxVxcLsZ27Q3HbKv2eeKzHX3beFFSbEkpVYownp5rON59-O2TeXPru93ld1T1ajqYvhfKw3nEIONem2TYorHFXfacEf2l2D6QHBp3uX99zNB4c8X8lS_RH98e744qTuVh59qwZDGAytJMjikE1GG9cb0LKtGmMzCHsGusDsminpCXHU9YZiuhc2SSNIDVCae0DJXMg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Warm duotone overlay: multiply darkens + tints warm */}
        <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply" />
        {/* Gradient: transparent at top, deep at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(12,10,9,0.15) 0%, rgba(12,10,9,0.1) 35%, rgba(12,10,9,0.75) 70%, rgba(12,10,9,0.97) 100%)',
          }}
        />
      </div>

      {/* Nav — fades in on load */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 w-full px-8 md:px-12 lg:px-16 pt-7 pb-0 max-w-7xl mx-auto"
      >
        <span className="text-[11px] font-label uppercase tracking-[0.2em] text-stone-300/60 select-none">
          Threshold
        </span>
      </motion.header>

      {/* Main — bottom-anchored; pt-24 guarantees gap below the THRESHOLD label */}
      <main className="relative z-10 flex-grow flex flex-col justify-end px-8 md:px-12 lg:px-16 pt-24 md:pt-32 pb-8 md:pb-10 w-full max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 28,
            delay: 0.08,
          }}
          className="mb-10 md:mb-14"
        >
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
            <span className="italic text-stone-300/90">moving out.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="mt-7 md:mt-9 text-sm md:text-base font-body text-stone-400/80 max-w-sm md:max-w-md leading-relaxed"
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
        <span className="text-base font-headline italic text-stone-50/30">Threshold</span>
        <p className="text-[10px] font-label uppercase tracking-widest text-stone-400/55">
          Cost data last updated per city · Not financial advice
        </p>
      </motion.footer>
    </div>
  )
}
