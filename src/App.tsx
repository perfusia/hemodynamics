import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ThemeProvider } from './ui/theme'
import { Footer, TopBar } from './ui/Shell'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView(); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-paper focus:p-2 font-sans">
        Skip to content
      </a>
      <ScrollManager />
      <TopBar />
      <main id="main" className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  )
}
