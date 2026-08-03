/* eslint-disable react-refresh/only-export-components -- application entry point */
import { lazy, Suspense, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'

const Landing = lazy(() => import('./pages/Landing'))
const Calculator = lazy(() => import('./pages/Calculator'))

const page = (() => {
  switch (window.location.pathname) {
    case '/london': return <Calculator city="london" />
    case '/basel': return <Calculator city="basel" />
    case '/zurich': return <Calculator city="zurich" />
    default: return <Landing />
  }
})()

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found — HTML template is broken')

createRoot(rootEl).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <Suspense fallback={null}>{page}</Suspense>
    </MotionConfig>
  </StrictMode>,
)
