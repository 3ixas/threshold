import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import Calculator from './pages/Calculator'

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/london', element: <Calculator city="london" /> },
  { path: '/basel', element: <Calculator city="basel" /> },
  { path: '/zurich', element: <Calculator city="zurich" /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
