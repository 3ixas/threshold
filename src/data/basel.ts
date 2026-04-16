import type { CityConfig } from '../lib/types'

const basel: CityConfig = {
  id: 'basel',
  name: 'Basel',
  currency: 'CHF',
  lastUpdated: '2025-01-01',
  depositRule: 'three_months',
  districts: [
    {
      id: 'grossbasel-west',
      name: 'Grossbasel West',
      rent: { room: 900, studio: 1300, '1bed': 1600, '2bed': 2100, '3bed': 2700 },
    },
    {
      id: 'kleinbasel',
      name: 'Kleinbasel',
      rent: { room: 800, studio: 1150, '1bed': 1400, '2bed': 1900, '3bed': 2400 },
    },
    {
      id: 'riehen',
      name: 'Riehen',
      rent: { room: 950, studio: 1400, '1bed': 1750, '2bed': 2300, '3bed': 2900 },
    },
  ],
  defaults: {
    transport: 86,
    utilities: 120,
    broadband: 40,
    food: 400,
    contentsInsurance: 20,
    movingCosts: 600,
    furnitureBudget: 2000,
    healthInsurance: 420,
    mediaFee: 9.35,
  },
}

export default basel
