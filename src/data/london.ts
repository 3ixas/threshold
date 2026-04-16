import type { CityConfig } from '../lib/types'

// ─────────────────────────────────────────────────────────────────
//  Data sources & verification status (April 2026)
//
//  ✅  Rent figures   — ONS Private Rental Market Statistics Jan–Dec 2025
//                       (londonrentalstatsaccessibleq42025.xlsx, Sheet 2)
//                       All figures are ONS median (£/month).
//                       Entries marked [est] had suppressed ONS data (<10
//                       sample) and are interpolated from adjacent boroughs.
//  ✅  Council tax     — GOV.UK Table 8a (2025–26) + GLA precept
//                       Borough-only totals from Table 8a; bexley-is-bonkers
//                       figures (which include GLA £490 precept) used for all
//                       32 boroughs. City of London estimated (see below).
//  ✅  TfL zone map    — research.md zone-to-borough table
//  ✅  Travelcard prices — official TfL adult-fares.pdf (2026 rates)
//  ✅  TV licence      — £180/year from 1 April 2026 → £15/month
//  ✅  Utilities       — Ofgem Q2 2026 cap + Thames Water 2025–26
//  ⚠️  City of London council tax — £1,419 derived:
//                       Table 8a borough portion £1,059 + GLA precept ~£360
//                       (excl. MOPAC element City doesn't pay). Low-impact:
//                       very few residential lets in the City.
// ─────────────────────────────────────────────────────────────────

const london: CityConfig = {
  id: 'london',
  name: 'London',
  currency: 'GBP',
  lastUpdated: '2026-04-01',
  depositRule: 'five_weeks',

  defaults: {
    transport: 172,   // fallback only — TfL zone lookup used per district
    utilities: 154,   // Ofgem Q2 2026: ~£99 energy + Thames Water ~£55/mo
    broadband: 32,
    food: 300,
    contentsInsurance: 15,
    movingCosts: 1000,
    furnitureBudget: 2500,
    tvLicence: 15,    // £180/year from 1 April 2026
  },

  // TfL annual Travelcard prices — official adult-fares.pdf (2026 rates)
  // Key = outermost zone. All Zone 1-N prices include Zone 1.
  tflAnnualCosts: {
    1: 1788,  // Zone 1-2 annual (Zone 1-only card not commonly used)
    2: 1788,  // Zone 1-2: £171.70/month annual card
    3: 2100,  // Zone 1-3: £201.60/month annual card
    4: 2568,  // Zone 1-4: £246.60/month annual card
    5: 3056,  // Zone 1-5: £293.40/month annual card (verified from PDF)
    6: 3264,  // Zone 1-6: £313.40/month annual card
  },

  districts: [
    // ── Zone 1 ─────────────────────────────────────────────────
    {
      id: 'city-of-london',
      name: 'City of London',
      tflZone: 1,
      councilTaxBandD: 1419, // derived: £1,059 borough (Table 8a) + ~£360 GLA excl. MOPAC
      rent: {
        room: 1100,    // [est] suppressed in ONS (too few samples)
        studio: 1850,  // ONS median
        '1bed': 2350,  // ONS median
        '2bed': 3100,  // ONS median
        '3bed': 3500,  // [est] suppressed in ONS — interpolated from Tower Hamlets/Westminster
      },
    },
    {
      id: 'camden',
      name: 'Camden',
      tflZone: 1,
      councilTaxBandD: 2106,
      rent: { room: 875, studio: 1285, '1bed': 1800, '2bed': 2500, '3bed': 3250 },
    },
    {
      id: 'hackney',
      name: 'Hackney',
      tflZone: 2,
      councilTaxBandD: 1967,
      rent: { room: 925, studio: 1280, '1bed': 2000, '2bed': 2350, '3bed': 3055 },
    },
    {
      id: 'islington',
      name: 'Islington',
      tflZone: 1,
      councilTaxBandD: 2012,
      rent: { room: 967, studio: 1400, '1bed': 1975, '2bed': 2500, '3bed': 3100 },
    },
    {
      id: 'kensington-chelsea',
      name: 'Kensington & Chelsea',
      tflZone: 1,
      councilTaxBandD: 1569,
      rent: { room: 1123, studio: 1579, '1bed': 2600, '2bed': 3510, '3bed': 5954 },
    },
    {
      id: 'lambeth',
      name: 'Lambeth',
      tflZone: 1,
      councilTaxBandD: 1954,
      rent: { room: 721, studio: 1350, '1bed': 1800, '2bed': 2250, '3bed': 2867 },
    },
    {
      id: 'southwark',
      name: 'Southwark',
      tflZone: 1,
      councilTaxBandD: 1878,
      rent: { room: 826, studio: 1550, '1bed': 1800, '2bed': 2250, '3bed': 2750 },
    },
    {
      id: 'tower-hamlets',
      name: 'Tower Hamlets',
      tflZone: 1,
      councilTaxBandD: 1755,
      rent: { room: 855, studio: 1723, '1bed': 1850, '2bed': 2250, '3bed': 2750 },
    },
    {
      id: 'wandsworth',
      name: 'Wandsworth',
      tflZone: 2,
      councilTaxBandD: 990,
      rent: { room: 1029, studio: 1450, '1bed': 1900, '2bed': 2320, '3bed': 2994 },
    },
    {
      id: 'westminster',
      name: 'Westminster',
      tflZone: 1,
      councilTaxBandD: 1017,
      rent: { room: 1006, studio: 1647, '1bed': 2492, '2bed': 3354, '3bed': 4471 },
    },

    // ── Zone 2 ─────────────────────────────────────────────────
    {
      id: 'brent',
      name: 'Brent',
      tflZone: 2,
      councilTaxBandD: 2133,
      rent: { room: 726, studio: 1213, '1bed': 1650, '2bed': 2000, '3bed': 2500 },
    },
    {
      id: 'ealing',
      name: 'Ealing',
      tflZone: 2,
      councilTaxBandD: 2041,
      rent: { room: 793, studio: 1300, '1bed': 1550, '2bed': 1900, '3bed': 2450 },
    },
    {
      id: 'greenwich',
      name: 'Greenwich',
      tflZone: 2,
      councilTaxBandD: 2012,
      rent: { room: 700, studio: 1215, '1bed': 1555, '2bed': 1900, '3bed': 2162 },
    },
    {
      id: 'hammersmith-fulham',
      name: 'Hammersmith & Fulham',
      tflZone: 2,
      councilTaxBandD: 1451,
      rent: { room: 871, studio: 1350, '1bed': 1800, '2bed': 2230, '3bed': 3300 },
    },
    {
      id: 'hounslow',
      name: 'Hounslow',
      tflZone: 2,
      councilTaxBandD: 2086,
      rent: { room: 826, studio: 1195, '1bed': 1500, '2bed': 1800, '3bed': 2300 },
    },
    {
      id: 'lewisham',
      name: 'Lewisham',
      tflZone: 2,
      councilTaxBandD: 2135,
      rent: { room: 893, studio: 1150, '1bed': 1450, '2bed': 1750, '3bed': 2200 },
    },
    {
      id: 'newham',
      name: 'Newham',
      tflZone: 2,
      councilTaxBandD: 1856,
      rent: { room: 726, studio: 1475, '1bed': 1654, '2bed': 1967, '3bed': 2250 },
    },

    // ── Zone 3 ─────────────────────────────────────────────────
    {
      id: 'barnet',
      name: 'Barnet',
      tflZone: 3,
      councilTaxBandD: 2036,
      rent: { room: 825, studio: 1150, '1bed': 1475, '2bed': 1775, '3bed': 2400 },
    },
    {
      id: 'bromley',
      name: 'Bromley',
      tflZone: 3,
      councilTaxBandD: 2042,
      rent: { room: 751, studio: 1000, '1bed': 1300, '2bed': 1650, '3bed': 1990 },
    },
    {
      id: 'croydon',
      name: 'Croydon',
      tflZone: 3,
      councilTaxBandD: 2480,
      rent: { room: 676, studio: 1050, '1bed': 1250, '2bed': 1575, '3bed': 2000 },
    },
    {
      id: 'haringey',
      name: 'Haringey',
      tflZone: 3,
      councilTaxBandD: 2208,
      rent: { room: 721, studio: 1100, '1bed': 1600, '2bed': 1925, '3bed': 2400 },
    },
    {
      id: 'merton',
      name: 'Merton',
      tflZone: 3,
      councilTaxBandD: 2088,
      rent: { room: 801, studio: 1200, '1bed': 1500, '2bed': 1750, '3bed': 2400 },
    },
    {
      id: 'richmond-thames',
      name: 'Richmond upon Thames',
      tflZone: 3,
      councilTaxBandD: 2372,
      rent: { room: 850, studio: 1085, '1bed': 1475, '2bed': 2000, '3bed': 2600 },
    },
    {
      id: 'waltham-forest',
      name: 'Waltham Forest',
      tflZone: 3,
      councilTaxBandD: 2278,
      rent: { room: 716, studio: 1175, '1bed': 1400, '2bed': 1700, '3bed': 2135 },
    },

    // ── Zone 4 ─────────────────────────────────────────────────
    {
      id: 'barking-dagenham',
      name: 'Barking & Dagenham',
      tflZone: 4,
      councilTaxBandD: 2098,
      rent: {
        room: 726,
        studio: 1100,  // [est] ONS suppressed — interpolated between room £726 and 1bed £1,350
        '1bed': 1350,
        '2bed': 1700,
        '3bed': 2000,
      },
    },
    {
      id: 'bexley',
      name: 'Bexley',
      tflZone: 4,
      councilTaxBandD: 2258,
      rent: { room: 776, studio: 975, '1bed': 1290, '2bed': 1600, '3bed': 1950 },
    },
    {
      id: 'enfield',
      name: 'Enfield',
      tflZone: 4,
      councilTaxBandD: 2164,
      rent: { room: 776, studio: 1148, '1bed': 1350, '2bed': 1675, '3bed': 2070 },
    },
    {
      id: 'kingston-thames',
      name: 'Kingston upon Thames',
      tflZone: 4,
      councilTaxBandD: 2488,
      rent: { room: 750, studio: 1300, '1bed': 1380, '2bed': 1700, '3bed': 2250 },
    },
    {
      id: 'redbridge',
      name: 'Redbridge',
      tflZone: 4,
      councilTaxBandD: 2190,
      rent: { room: 776, studio: 1100, '1bed': 1400, '2bed': 1700, '3bed': 2100 },
    },
    {
      id: 'sutton',
      name: 'Sutton',
      tflZone: 4,
      councilTaxBandD: 2270,
      rent: { room: 776, studio: 956, '1bed': 1250, '2bed': 1575, '3bed': 2000 },
    },

    // ── Zone 5 ─────────────────────────────────────────────────
    {
      id: 'harrow',
      name: 'Harrow',
      tflZone: 5,
      councilTaxBandD: 2396,
      rent: { room: 836, studio: 1000, '1bed': 1400, '2bed': 1745, '3bed': 2236 },
    },
    {
      id: 'hillingdon',
      name: 'Hillingdon',
      tflZone: 5,
      councilTaxBandD: 1952,
      rent: { room: 675, studio: 1020, '1bed': 1300, '2bed': 1628, '3bed': 1840 },
    },

    // ── Zone 6 ─────────────────────────────────────────────────
    {
      id: 'havering',
      name: 'Havering',
      tflZone: 6,
      councilTaxBandD: 2314,
      rent: { room: 801, studio: 1000, '1bed': 1250, '2bed': 1550, '3bed': 1900 },
    },
  ],
}

export default london
