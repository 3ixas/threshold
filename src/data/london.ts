import type { CityConfig } from '../lib/types'

// ─────────────────────────────────────────────────────────────────
//  HITL REVIEW REQUIRED before closing Slice 4
//
//  ✅  Council tax Band D  — all 33 boroughs from research.md (Apr 2026)
//  ✅  TfL zone mapping    — research.md zone-to-borough table
//  ✅  Travelcard prices   — verified except Zone 1–5 (see FLAG 3)
//  ✅  Fixed costs         — TV licence, water, broadband from research.md
//  ⚠️  FLAG 1: City of London council tax — ~£1,500 estimate, verify at
//              cityoflondon.gov.uk/services/council-tax/council-tax-bands-and-charges
//  ⚠️  FLAG 2: TfL Zone 1–5 annual price — ~£2,900 estimate, verify at
//              content.tfl.gov.uk/adult-fares.pdf
//  🚨  FLAG 3: ALL RENT FIGURES ARE PLACEHOLDERS
//              research.md says: "Don't use estimates — use the ONS spreadsheet"
//              Source: ons.gov.uk/file?uri=/economy/inflationandpriceindices/
//                      adhocs/3264privaterentalmarketinlondonjanuary2025todecember2025/
//                      londonrentalstatsaccessibleq42025.xlsx
//              Replace every borough's rent object with ONS median figures
//              before this slice is approved.
// ─────────────────────────────────────────────────────────────────

const london: CityConfig = {
  id: 'london',
  name: 'London',
  currency: 'GBP',
  lastUpdated: '2026-04-01',
  depositRule: 'five_weeks',

  defaults: {
    // Transport: TfL zone lookup used instead — this is a fallback only
    transport: 172,
    // Q2 2026 Ofgem cap: ~£47 electricity + ~£52 gas = ~£99 for 1-bed.
    // Thames Water: £655/year ≈ £55/month. Total utilities ≈ £154.
    utilities: 154,
    broadband: 32,
    food: 300,
    contentsInsurance: 15,
    movingCosts: 1000,
    furnitureBudget: 2500,
    // TV licence: £180/year from 1 April 2026 → £15/month
    tvLicence: 15,
  },

  // TfL annual Travelcard prices (adult, 2025 fares, verified from research.md)
  // Key = outermost zone used. Zones 1–2 is the minimum meaningful card.
  // ⚠️ FLAG 2: Zone 1–5 (key 5) is ~£2,900 estimate — verify against adult-fares.pdf
  tflAnnualCosts: {
    1: 1788, // Zone 1–2 (minimum card; Zone 1-only not commonly sold annually)
    2: 1788, // Zone 1–2  — £171.70/month × 12 = £2,060.40... using annual £1,788
    3: 2100, // Zone 1–3  — £201.60/month × 12 = £2,419. Using annual £2,100
    4: 2568, // Zone 1–4  — £246.60/month × 12 = £2,959. Using annual £2,568
    5: 2900, // Zone 1–5  — ⚠️ ESTIMATE ~£280/month. Verify at adult-fares.pdf
    6: 3264, // Zone 1–6  — £313.40/month × 12 = £3,760. Using annual £3,264
  },

  // ─────────────────────────────────────────────────────────────
  //  Districts: 33 London boroughs
  //  Zone assignments: research.md zone-to-borough table
  //  Council tax: research.md Band D rates (2025–26 financial year)
  //  Rents: 🚨 PLACEHOLDER — replace with ONS median figures per borough
  // ─────────────────────────────────────────────────────────────
  districts: [
    // ── Zone 1 ─────────────────────────────────────────────────
    {
      id: 'city-of-london',
      name: 'City of London',
      tflZone: 1,
      councilTaxBandD: 1500, // ⚠️ FLAG 1: estimate — verify at cityoflondon.gov.uk
      rent: { room: 1400, studio: 2000, '1bed': 2600, '2bed': 3500, '3bed': 4600 },
    },
    {
      id: 'camden',
      name: 'Camden',
      tflZone: 1,
      councilTaxBandD: 2106,
      rent: { room: 1350, studio: 1900, '1bed': 2500, '2bed': 3300, '3bed': 4400 },
    },
    {
      id: 'hackney',
      name: 'Hackney',
      tflZone: 2,
      councilTaxBandD: 1967,
      rent: { room: 1100, studio: 1550, '1bed': 2000, '2bed': 2650, '3bed': 3500 },
    },
    {
      id: 'islington',
      name: 'Islington',
      tflZone: 1,
      councilTaxBandD: 2012,
      rent: { room: 1250, studio: 1750, '1bed': 2300, '2bed': 3050, '3bed': 4000 },
    },
    {
      id: 'kensington-chelsea',
      name: 'Kensington & Chelsea',
      tflZone: 1,
      councilTaxBandD: 1569,
      rent: { room: 1700, studio: 2500, '1bed': 3300, '2bed': 4800, '3bed': 6500 },
    },
    {
      id: 'lambeth',
      name: 'Lambeth',
      tflZone: 1,
      councilTaxBandD: 1954,
      rent: { room: 1100, studio: 1550, '1bed': 2000, '2bed': 2700, '3bed': 3600 },
    },
    {
      id: 'southwark',
      name: 'Southwark',
      tflZone: 1,
      councilTaxBandD: 1878,
      rent: { room: 1150, studio: 1600, '1bed': 2100, '2bed': 2800, '3bed': 3700 },
    },
    {
      id: 'tower-hamlets',
      name: 'Tower Hamlets',
      tflZone: 1,
      councilTaxBandD: 1755,
      rent: { room: 1150, studio: 1600, '1bed': 2100, '2bed': 2800, '3bed': 3700 },
    },
    {
      id: 'wandsworth',
      name: 'Wandsworth',
      tflZone: 2,
      councilTaxBandD: 990,
      rent: { room: 1150, studio: 1600, '1bed': 2050, '2bed': 2750, '3bed': 3650 },
    },
    {
      id: 'westminster',
      name: 'Westminster',
      tflZone: 1,
      councilTaxBandD: 1017,
      rent: { room: 1600, studio: 2300, '1bed': 3000, '2bed': 4200, '3bed': 5800 },
    },

    // ── Zone 2 ─────────────────────────────────────────────────
    {
      id: 'brent',
      name: 'Brent',
      tflZone: 2,
      councilTaxBandD: 2133,
      rent: { room: 1050, studio: 1450, '1bed': 1850, '2bed': 2500, '3bed': 3300 },
    },
    {
      id: 'ealing',
      name: 'Ealing',
      tflZone: 2,
      councilTaxBandD: 2041,
      rent: { room: 1000, studio: 1400, '1bed': 1800, '2bed': 2400, '3bed': 3200 },
    },
    {
      id: 'greenwich',
      name: 'Greenwich',
      tflZone: 2,
      councilTaxBandD: 2012,
      rent: { room: 950, studio: 1300, '1bed': 1700, '2bed': 2250, '3bed': 3000 },
    },
    {
      id: 'hammersmith-fulham',
      name: 'Hammersmith & Fulham',
      tflZone: 2,
      councilTaxBandD: 1451,
      rent: { room: 1200, studio: 1700, '1bed': 2200, '2bed': 3000, '3bed': 4000 },
    },
    {
      id: 'hounslow',
      name: 'Hounslow',
      tflZone: 2,
      councilTaxBandD: 2086,
      rent: { room: 950, studio: 1300, '1bed': 1650, '2bed': 2200, '3bed': 2900 },
    },
    {
      id: 'lewisham',
      name: 'Lewisham',
      tflZone: 2,
      councilTaxBandD: 2135,
      rent: { room: 950, studio: 1300, '1bed': 1650, '2bed': 2200, '3bed': 2900 },
    },
    {
      id: 'newham',
      name: 'Newham',
      tflZone: 2,
      councilTaxBandD: 1856,
      rent: { room: 950, studio: 1300, '1bed': 1650, '2bed': 2200, '3bed': 2900 },
    },

    // ── Zone 3 ─────────────────────────────────────────────────
    {
      id: 'barnet',
      name: 'Barnet',
      tflZone: 3,
      councilTaxBandD: 2036,
      rent: { room: 900, studio: 1250, '1bed': 1600, '2bed': 2100, '3bed': 2800 },
    },
    {
      id: 'bromley',
      name: 'Bromley',
      tflZone: 3,
      councilTaxBandD: 2042,
      rent: { room: 850, studio: 1200, '1bed': 1550, '2bed': 2050, '3bed': 2700 },
    },
    {
      id: 'croydon',
      name: 'Croydon',
      tflZone: 3,
      councilTaxBandD: 2480,
      rent: { room: 800, studio: 1100, '1bed': 1450, '2bed': 1900, '3bed': 2550 },
    },
    {
      id: 'haringey',
      name: 'Haringey',
      tflZone: 3,
      councilTaxBandD: 2208,
      rent: { room: 1000, studio: 1400, '1bed': 1800, '2bed': 2400, '3bed': 3200 },
    },
    {
      id: 'merton',
      name: 'Merton',
      tflZone: 3,
      councilTaxBandD: 2088,
      rent: { room: 900, studio: 1250, '1bed': 1600, '2bed': 2100, '3bed': 2800 },
    },
    {
      id: 'richmond-thames',
      name: 'Richmond upon Thames',
      tflZone: 3,
      councilTaxBandD: 2372,
      rent: { room: 1050, studio: 1450, '1bed': 1900, '2bed': 2550, '3bed': 3400 },
    },
    {
      id: 'waltham-forest',
      name: 'Waltham Forest',
      tflZone: 3,
      councilTaxBandD: 2278,
      rent: { room: 900, studio: 1250, '1bed': 1600, '2bed': 2100, '3bed': 2800 },
    },

    // ── Zone 4 ─────────────────────────────────────────────────
    {
      id: 'barking-dagenham',
      name: 'Barking & Dagenham',
      tflZone: 4,
      councilTaxBandD: 2098,
      rent: { room: 800, studio: 1100, '1bed': 1400, '2bed': 1850, '3bed': 2450 },
    },
    {
      id: 'bexley',
      name: 'Bexley',
      tflZone: 4,
      councilTaxBandD: 2258,
      rent: { room: 800, studio: 1100, '1bed': 1350, '2bed': 1800, '3bed': 2400 },
    },
    {
      id: 'enfield',
      name: 'Enfield',
      tflZone: 4,
      councilTaxBandD: 2164,
      rent: { room: 800, studio: 1100, '1bed': 1400, '2bed': 1850, '3bed': 2450 },
    },
    {
      id: 'kingston-thames',
      name: 'Kingston upon Thames',
      tflZone: 4,
      councilTaxBandD: 2488,
      rent: { room: 950, studio: 1300, '1bed': 1700, '2bed': 2250, '3bed': 3000 },
    },
    {
      id: 'redbridge',
      name: 'Redbridge',
      tflZone: 4,
      councilTaxBandD: 2190,
      rent: { room: 800, studio: 1100, '1bed': 1400, '2bed': 1850, '3bed': 2450 },
    },
    {
      id: 'sutton',
      name: 'Sutton',
      tflZone: 4,
      councilTaxBandD: 2270,
      rent: { room: 800, studio: 1100, '1bed': 1400, '2bed': 1850, '3bed': 2450 },
    },

    // ── Zone 5 ─────────────────────────────────────────────────
    {
      id: 'harrow',
      name: 'Harrow',
      tflZone: 5,
      councilTaxBandD: 2396,
      rent: { room: 750, studio: 1000, '1bed': 1300, '2bed': 1700, '3bed': 2250 },
    },
    {
      id: 'hillingdon',
      name: 'Hillingdon',
      tflZone: 5,
      councilTaxBandD: 1952,
      rent: { room: 750, studio: 1000, '1bed': 1250, '2bed': 1650, '3bed': 2200 },
    },

    // ── Zone 6 ─────────────────────────────────────────────────
    {
      id: 'havering',
      name: 'Havering',
      tflZone: 6,
      councilTaxBandD: 2314,
      rent: { room: 700, studio: 950, '1bed': 1200, '2bed': 1600, '3bed': 2100 },
    },
  ],
}

export default london
