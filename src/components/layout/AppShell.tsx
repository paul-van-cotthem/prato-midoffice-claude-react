import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const { t } = useTranslation()

  // Focus management on route change
  useEffect(() => {
    const h1 = mainRef.current?.querySelector('h1')
    if (h1) {
      h1.setAttribute('tabindex', '-1')
      h1.focus()
    }
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-prato-bg">
      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        {t('common.slaan_naar_inhoud')}
      </a>

      <Sidebar />

      <main
        id="main-content"
        ref={mainRef}
        className="flex-1 overflow-y-auto pl-60 relative"
        style={{ minHeight: '100vh' }}
        aria-live="polite"
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
