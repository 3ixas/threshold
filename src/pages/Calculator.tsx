interface CalculatorProps {
  city: 'london' | 'basel' | 'zurich'
}

const cityLabels: Record<CalculatorProps['city'], string> = {
  london: 'London',
  basel: 'Basel',
  zurich: 'Zurich',
}

export default function Calculator({ city }: CalculatorProps) {
  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-headline">{cityLabels[city]}</h1>
        <p className="text-sm font-label uppercase tracking-wider text-on-surface-variant">
          Calculator — coming soon
        </p>
      </div>
    </div>
  )
}
