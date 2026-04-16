import type { CityConfig } from '../lib/types'

// ─────────────────────────────────────────────────────────────────
//  Data sources & verification status (April 2026)
//
//  ✅  District groupings — 7 areas per research.md strategy
//  ✅  Rent figures — Statistik Basel-Stadt Mietpreisraster price
//                    relativities applied to Numbeo 2025-26 baseline
//                    (Iselin = 0% baseline, ~CHF 1,400/month 1-bed)
//  ✅  Serafe media fee — CHF 335/year → CHF 27.92/month (serafe.ch)
//  ✅  BVB/TNW U-Abo — CHF 86/month, no zone-10-only option (tnw.ch)
//  ✅  Deposit rule — 3 months' rent (Art. 257e CO)
//  ✅  Broadband — CHF 55/month (research.md: Salt/Swisscom range)
//  ✅  Utilities — CHF 180/month estimate for 1-bed (Numbeo Basel 2026)
//  ⚠️  FLAG: Health insurance — CHF 400/month estimate for 25-year-old
//            CHF 300 franchise, standard model in Basel-Stadt canton.
//            HITL: verify at priminfo.ch before closing this slice.
//            (research.md range: CHF 450-520 standard, 330-380 HMO)
//  ⚠️  FLAG: Zurich Kreise GeoJSON — using approximate bounding boxes.
//            Stadt Zürich portal requires browser auth. Replace with
//            exact polygons when available.
// ─────────────────────────────────────────────────────────────────

const basel: CityConfig = {
  id: 'basel',
  name: 'Basel',
  currency: 'CHF',
  lastUpdated: '2026-04-01',
  depositRule: 'three_months',

  defaults: {
    transport: 86,     // BVB/TNW U-Abo CHF 86/month (verified tnw.ch)
    utilities: 180,    // electricity + heating + water, 1-bed estimate
    broadband: 55,     // Salt Home / Swisscom typical CHF 49-80/month
    food: 400,
    contentsInsurance: 15,
    movingCosts: 600,
    furnitureBudget: 2000,
    healthInsurance: 400, // ⚠️ ESTIMATE — verify at priminfo.ch
    mediaFee: 27.92,   // Serafe CHF 335/year ÷ 12 (2025–26 rate)
  },

  // ─────────────────────────────────────────────────────────────────
  //  7 grouped districts — Mietpreisraster relative to Iselin (0%)
  //  Rents derived from price relativities applied to CHF 1,400 baseline
  // ─────────────────────────────────────────────────────────────────
  districts: [
    {
      id: 'altstadt',
      name: 'Altstadt & Vorstädte',
      // Altstadt Grossbasel +20%, Vorstädte +10% → avg +15%
      rent: { room: 920, studio: 1265, '1bed': 1610, '2bed': 2185, '3bed': 2875 },
    },
    {
      id: 'gundeldingen',
      name: 'Gundeldingen & St. Alban',
      // St. Alban, Gundeldingen, Am Ring, Breite → ~+3%
      rent: { room: 825, studio: 1135, '1bed': 1440, '2bed': 1960, '3bed': 2575 },
    },
    {
      id: 'bachletten',
      name: 'Bachletten & Gotthelf',
      // Bachletten, Gotthelf → ~+2%
      rent: { room: 815, studio: 1120, '1bed': 1430, '2bed': 1940, '3bed': 2550 },
    },
    {
      id: 'iselin',
      name: 'Iselin & St. Johann',
      // Iselin, St. Johann → baseline 0%
      rent: { room: 800, studio: 1100, '1bed': 1400, '2bed': 1900, '3bed': 2500 },
    },
    {
      id: 'bruderholz',
      name: 'Bruderholz',
      // Bruderholz → +11%
      rent: { room: 890, studio: 1220, '1bed': 1555, '2bed': 2110, '3bed': 2775 },
    },
    {
      id: 'kleinbasel-nord',
      name: 'Kleinbasel Nord',
      // Matthäus, Klybeck (-7%), Kleinhüningen (-6%) → avg -6%
      rent: { room: 750, studio: 1035, '1bed': 1315, '2bed': 1785, '3bed': 2350 },
    },
    {
      id: 'kleinbasel-sued',
      name: 'Kleinbasel Süd',
      // Altstadt Kleinbasel, Clara, Wettstein, Hirzbrunnen, Rosental (-5%) → avg -4%
      rent: { room: 770, studio: 1055, '1bed': 1345, '2bed': 1825, '3bed': 2400 },
    },
  ],
}

export default basel
