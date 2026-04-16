import { Link } from 'react-router-dom'

interface CityCardProps {
  name: string
  region: string
  currency: string
  to: string
}

function CityCard({ name, region, currency, to }: CityCardProps) {
  return (
    <Link
      to={to}
      className="group block w-full md:w-[280px] bg-white/25 backdrop-blur-[24px] border border-white/40 hover:border-stone-200/40 p-6 md:p-8 transition-all duration-300 flex justify-between items-center"
    >
      <div className="flex flex-col">
        <span className="text-2xl md:text-3xl font-headline text-stone-50">
          {name}
        </span>
        <span className="text-sm font-label uppercase tracking-wider text-stone-400 mt-2">
          {region} · {currency}
        </span>
      </div>
      <span className="material-symbols-outlined text-stone-400 group-hover:text-stone-50 group-hover:translate-x-1 transition-all duration-300 text-3xl font-light select-none">
        arrow_forward
      </span>
    </Link>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Full-bleed background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe_MMdhrexQ3QYWfC1riD9Wu6yJxcnV6Emky2zT77YFWB-8yEF1hJLiFHIN7EkIoPvETreNDxVxcLsZ27Q3HbKv2eeKzHX3beFFSbEkpVYownp5rON59-O2TeXPru93ld1T1ajqYvhfKw3nEIONem2TYorHFXfacEf2l2D6QHBp3uX99zNB4c8X8lS_RH98e744qTuVh59qwZDGAytJMjikE1GG9cb0LKtGmMzCHsGusDsminpCXHU9YZiuhc2SSNIDVCae0DJXMg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay — multiply blend for depth */}
        <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply" />
        {/* Bottom gradient — draws eye up to content */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950/90" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 w-full px-8 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-headline italic tracking-wide text-stone-50">
          Threshold
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 py-24 md:py-32 w-full max-w-7xl mx-auto">
        {/* Hero copy */}
        <div className="text-center mb-28 md:mb-36 space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-headline text-stone-50 tracking-tight leading-tight">
            The real cost of{' '}
            <br className="hidden md:block" />
            <span className="italic text-stone-300">moving out</span>
          </h1>
          <p className="text-base md:text-lg font-body text-stone-300 max-w-xl mx-auto leading-relaxed">
            Select a city to see exactly what independent living costs — upfront
            and every month.
          </p>
        </div>

        {/* City selection cards */}
        <div className="w-full flex flex-col md:flex-row justify-center gap-6 md:gap-8">
          <CityCard name="London" region="England" currency="GBP" to="/london" />
          <CityCard name="Basel" region="Switzerland" currency="CHF" to="/basel" />
          <CityCard name="Zurich" region="Switzerland" currency="CHF" to="/zurich" />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full flex flex-col md:flex-row items-center px-12 py-12 max-w-7xl mx-auto border-t border-stone-200/10 mt-auto">
        <div className="text-lg font-headline text-stone-50 mb-4 md:mb-0 w-full md:w-1/3">
          Threshold
        </div>
        <div className="text-[10px] font-label uppercase tracking-widest text-stone-400/40 text-center w-full md:w-1/3">
          Cost data last updated per city · Not financial advice
        </div>
        <div className="w-full md:w-1/3" />
      </footer>
    </div>
  )
}
