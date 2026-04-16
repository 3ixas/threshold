import type { CityConfig } from '../lib/types'

const london: CityConfig = {
  id: 'london',
  name: 'London',
  currency: 'GBP',
  lastUpdated: '2025-01-01',
  depositRule: 'five_weeks',
  districts: [
    {
      id: 'hackney',
      name: 'Hackney',
      tflZone: 2,
      councilTaxBandD: 1836,
      rent: { room: 1050, studio: 1500, '1bed': 1900, '2bed': 2400, '3bed': 3100 },
    },
    {
      id: 'southwark',
      name: 'Southwark',
      tflZone: 1,
      councilTaxBandD: 1669,
      rent: { room: 1100, studio: 1600, '1bed': 2100, '2bed': 2700, '3bed': 3400 },
    },
    {
      id: 'lewisham',
      name: 'Lewisham',
      tflZone: 3,
      councilTaxBandD: 1965,
      rent: { room: 900, studio: 1250, '1bed': 1600, '2bed': 2050, '3bed': 2600 },
    },
  ],
  defaults: {
    transport: 153,  // zone 1-2 monthly Travelcard ÷ 12 placeholder
    utilities: 140,
    broadband: 35,
    food: 300,
    contentsInsurance: 15,
    movingCosts: 800,
    furnitureBudget: 2000,
    tvLicence: 13.25,
  },
  tflAnnualCosts: {
    1: 1580,
    2: 1580,
    3: 1856,
    4: 2212,
    5: 2596,
    6: 2776,
  },
}

export default london
