import { lazy, Suspense, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'

const Landing = lazy(() => import('./pages/Landing'))
const Calculator = lazy(() => import('./pages/Calculator'))

const router = createBrowserRouter([
  { path: '/', element: <Suspense fallback={null}><Landing /></Suspense> },
  { path: '/london', element: <Suspense fallback={null}><Calculator city="london" /></Suspense> },
  { path: '/basel', element: <Suspense fallback={null}><Calculator city="basel" /></Suspense> },
  { path: '/zurich', element: <Suspense fallback={null}><Calculator city="zurich" /></Suspense> },
])

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found — HTML template is broken')

createRoot(rootEl).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </StrictMode>,
)
