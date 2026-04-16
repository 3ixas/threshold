import type { CityConfig } from '../lib/types'

const zurich: CityConfig = {
  id: 'zurich',
  name: 'Zurich',
  currency: 'CHF',
  lastUpdated: '2025-01-01',
  depositRule: 'three_months',
  districts: [
    {
      id: 'kreis-1',
      name: 'Kreis 1 (Altstadt)',
      rent: { room: 1100, studio: 1800, '1bed': 2300, '2bed': 3200, '3bed': 4200 },
    },
    {
      id: 'kreis-4',
      name: 'Kreis 4 (Aussersihl)',
      rent: { room: 950, studio: 1500, '1bed': 1900, '2bed': 2600, '3bed': 3400 },
    },
    {
      id: 'kreis-11',
      name: 'Kreis 11 (Oerlikon)',
      rent: { room: 880, studio: 1350, '1bed': 1750, '2bed': 2350, '3bed': 3000 },
    },
  ],
  defaults: {
    transport: 95,
    utilities: 130,
    broadband: 45,
    food: 450,
    contentsInsurance: 22,
    movingCosts: 700,
    furnitureBudget: 2500,
    healthInsurance: 480,
    mediaFee: 9.35,
  },
}

export default zurich
