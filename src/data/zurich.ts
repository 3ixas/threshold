import type { CityConfig } from '../lib/types'

// ─────────────────────────────────────────────────────────────────
//  Data sources & verification status (April 2026)
//
//  ✅  Districts — all 12 Stadtkreise
//  ✅  Rent figures — Numbeo Feb 2026 + Kreis price/m² relativities
//                    from research.md. City average 1-bed ~CHF 2,056
//                    (midpoint: city centre 2,351 / outside 1,761)
//  ✅  Serafe — CHF 335/year → CHF 27.92/month
//  ✅  ZVV transport — CHF 88/month zone 110 (1-2 zones, verified zvv.ch)
//                     CHF 365/year voter initiative NOT YET active (Apr 2026)
//  ✅  Deposit rule — 3 months' rent (Art. 257e CO)
//  ✅  Broadband — CHF 55/month (Swisscom / Sunrise typical)
//  ✅  Utilities — CHF 210/month estimate for 1-bed (Numbeo Zurich 2026)
//  ⚠️  FLAG: Health insurance — CHF 380/month estimate for 25-year-old
//            CHF 300 franchise, standard model in Zurich canton.
//            HITL: verify at priminfo.ch before closing this slice.
//            (research.md range: CHF 380-450 standard, 270-340 HMO)
//  ⚠️  FLAG: GeoJSON uses approximate bounding boxes — replace with
//            exact Stadt Zürich polygons when portal access available.
// ─────────────────────────────────────────────────────────────────

const zurich: CityConfig = {
  id: 'zurich',
  name: 'Zurich',
  currency: 'CHF',
  lastUpdated: '2026-04-01',
  depositRule: 'three_months',

  defaults: {
    transport: 88,     // ZVV NetworkPass zone 110, CHF 88/month (verified zvv.ch)
    utilities: 210,    // ewz electricity + ancillary, 1-bed estimate
    broadband: 55,
    food: 450,
    contentsInsurance: 22,
    movingCosts: 700,
    furnitureBudget: 2500,
    healthInsurance: 380, // ⚠️ ESTIMATE — verify at priminfo.ch
    mediaFee: 27.92,   // Serafe CHF 335/year ÷ 12
  },

  // ─────────────────────────────────────────────────────────────────
  //  12 Stadtkreise — Numbeo Feb 2026 city-level data + per-Kreis
  //  CHF/m² relativities from research.md (Kreis 1 highest, Kreis 11/12 cheapest)
  // ─────────────────────────────────────────────────────────────────
  districts: [
    {
      id: 'kreis-1',
      name: 'Kreis 1',
      // Altstadt — CHF 30-35/m², ~+25% above outside avg
      rent: { room: 1150, studio: 1850, '1bed': 2350, '2bed': 3300, '3bed': 4450 },
    },
    {
      id: 'kreis-2',
      name: 'Kreis 2',
      // Enge — CHF 26-30/m², ~+15%
      rent: { room: 1000, studio: 1600, '1bed': 2025, '2bed': 2850, '3bed': 3850 },
    },
    {
      id: 'kreis-3',
      name: 'Kreis 3',
      // Wiedikon — CHF 22-26/m², ~city average
      rent: { room: 880, studio: 1400, '1bed': 1760, '2bed': 2500, '3bed': 3350 },
    },
    {
      id: 'kreis-4',
      name: 'Kreis 4',
      // Aussersihl — CHF 21-25/m²
      rent: { room: 880, studio: 1380, '1bed': 1750, '2bed': 2475, '3bed': 3300 },
    },
    {
      id: 'kreis-5',
      name: 'Kreis 5',
      // Industriequartier — CHF 22-26/m², ~+5%
      rent: { room: 920, studio: 1450, '1bed': 1850, '2bed': 2600, '3bed': 3500 },
    },
    {
      id: 'kreis-6',
      name: 'Kreis 6',
      // Unterstrass — CHF 22-26/m², ~+5%
      rent: { room: 930, studio: 1460, '1bed': 1850, '2bed': 2600, '3bed': 3500 },
    },
    {
      id: 'kreis-7',
      name: 'Kreis 7',
      // Fluntern — hillside, CHF 24-28/m², ~+15%
      rent: { room: 1000, studio: 1600, '1bed': 2025, '2bed': 2850, '3bed': 3850 },
    },
    {
      id: 'kreis-8',
      name: 'Kreis 8',
      // Riesbach / Seefeld — CHF 28-33/m², ~+20%
      rent: { room: 1050, studio: 1700, '1bed': 2115, '2bed': 3000, '3bed': 4050 },
    },
    {
      id: 'kreis-9',
      name: 'Kreis 9',
      // Altstetten — affordable west, CHF 18-22/m², ~-10%
      rent: { room: 800, studio: 1250, '1bed': 1585, '2bed': 2200, '3bed': 2950 },
    },
    {
      id: 'kreis-10',
      name: 'Kreis 10',
      // Höngg — residential north-west, CHF 19-23/m², ~-5%
      rent: { room: 835, studio: 1325, '1bed': 1675, '2bed': 2350, '3bed': 3150 },
    },
    {
      id: 'kreis-11',
      name: 'Kreis 11',
      // Oerlikon — most affordable inner, CHF 18-22/m², ~-15%
      rent: { room: 760, studio: 1200, '1bed': 1500, '2bed': 2100, '3bed': 2825 },
    },
    {
      id: 'kreis-12',
      name: 'Kreis 12',
      // Schwamendingen — most affordable, CHF 17-21/m², ~-20%
      rent: { room: 720, studio: 1150, '1bed': 1410, '2bed': 1975, '3bed': 2650 },
    },
  ],
}

export default zurich
