import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@fontsource-variable/archivo/standard.css'
import '@fontsource-variable/stix-two-text/wght.css'
import '@fontsource-variable/stix-two-text/wght-italic.css'
import { router } from './router'
import './index.css'

// A stale path-style link (from the old 404 redirect) is folded into the hash route.
const redirect = new URLSearchParams(window.location.search).get('redirect')
if (redirect) {
  const base = import.meta.env.BASE_URL
  const route = redirect.startsWith(base) ? redirect.slice(base.length - 1) : redirect
  window.history.replaceState(null, '', `${base}#${route === '/' ? '/' : route}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
