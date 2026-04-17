# Threshold

**The real cost of moving out** — a rental affordability calculator for London, Basel, and Zurich.

Select a city and district, set your living situation, and get an instant breakdown of what it actually costs to move out: upfront on day one and every month after.

![Landing page](docs/screenshot-landing.png)

---

## What it does

Most rent calculators stop at the monthly rent figure. Threshold doesn't.

Enter your borough or district and Threshold builds the full picture:

| Upfront costs | Monthly costs |
|---|---|
| Security deposit (5 weeks / 3 months) | Rent |
| First month's rent | Council tax / no equivalent |
| Moving costs | Utilities |
| Furniture & setup | Broadband |
| | Transport (TfL zone-aware for London) |
| | Health insurance (Swiss cities) |
| | TV licence / Serafe media fee |
| | Contents insurance |
| | Food & lifestyle |

Results update instantly — no submit button. Every configuration is encoded in the URL so any scenario is fully shareable.

---

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/screenshot-calculator.png" alt="District map and controls" /></td>
    <td width="50%"><img src="docs/screenshot-costs.png" alt="Cost breakdown" /></td>
  </tr>
  <tr>
    <td align="center"><em>Interactive district map with borough selection</em></td>
    <td align="center"><em>Full upfront and monthly cost breakdown</em></td>
  </tr>
</table>

---

## Cities

| City | Currency | Districts | Transport |
|------|----------|-----------|-----------|
| **London** | GBP | 33 boroughs (ONS boundaries) | TfL zone-aware annual Travelcard pricing |
| **Basel** | CHF | 7 grouped districts | BVB/TNW U-Abo flat rate |
| **Zurich** | CHF | 12 Stadtkreise | ZVV NetworkPass zone 110 |

Cost data sourced from ONS, Numbeo, official transport operators, and government statistics. Last updated April 2026.

---

## Stack

- **Vite + React 19 + TypeScript** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/vite` — no PostCSS config
- **framer-motion** — animation system with `prefers-reduced-motion` support
- **react-map-gl + MapLibre GL** — interactive district maps
- **React Router 7** — file-based routing with lazy-loaded pages
- **Vitest + Testing Library** — 182 tests, pure functions, no mocks

**Key architectural principle:** all calculator state lives in the URL. No Redux, no Zustand, no Context — just `URLSearchParams` serialised on every input change. Any configuration is a shareable link.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # TypeScript check + production build
npm run test       # run all 182 tests
npm run lint       # ESLint
```

---

## Project structure

```
src/
├── data/           # City configs (rent, costs, map centre) + GeoJSON boundaries
├── lib/            # Pure calculation functions + URL state serialisation
│   ├── calculate.ts        # Monthly and upfront cost engine
│   ├── affordability.ts    # CAN_AFFORD_NOW / NOT_YET / INCOME_INSUFFICIENT
│   ├── suggestions.ts      # "What if" cost-saving suggestions
│   └── url-state.ts        # Serialise/deserialise inputs ↔ URLSearchParams
├── components/     # DistrictMap, ConfigPanel, AffordabilityPanel, etc.
└── pages/          # Landing, Calculator (LondonCalculator + SwissCalculator)
```

---

*Not financial advice.*
