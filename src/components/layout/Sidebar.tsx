import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Building2, MessageSquare, LogOut, Users, FileText, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/hooks/useAuth'

export function Sidebar() {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    void navigate(ROUTES.LOGIN)
  }

  return (
    <aside
      className="sidebar fixed inset-y-0 left-0 flex w-60 flex-col z-30 shadow-lg bg-prato-sidebar"
      aria-label={t('nav.navigatie')}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        if (link) {
          const to = link.getAttribute('href');
          console.log('[SIDEBAR] Navigating to:', to);
        }
      }}
    >
      {/* Prato brand */}
      <div
        className="flex flex-col items-start justify-center py-6 px-6 gap-3 text-left"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="bg-white px-2 py-1.5 rounded shadow-sm inline-block">
          <img src="/prato-logo.webp" alt="Prato" className="h-6 w-auto" />
        </div>
        <span className="w-full text-lg text-white uppercase tracking-widest font-bold">
          midoffice fix
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            )
          }
          end
        >
          <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
          {t('nav.dashboard')}
        </NavLink>

        <NavLink
          to={ROUTES.WERKGEVERS}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <Building2 className="h-5 w-5 flex-shrink-0" />
          {t('nav.werkgevers')}
        </NavLink>

        <NavLink
          to={ROUTES.BERICHTEN}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <MessageSquare className="h-5 w-5 flex-shrink-0" />
          {t('nav.berichten')}
        </NavLink>
        
        <NavLink
          to={ROUTES.PERSONEN_LIST}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <Users className="h-5 w-5 flex-shrink-0" />
          {t('nav.personen')}
        </NavLink>

        <NavLink
          to={ROUTES.CONTRACTEN_LIST}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <FileText className="h-5 w-5 flex-shrink-0" />
          {t('nav.contracten')}
        </NavLink>

        <NavLink
          to={ROUTES.LOONBEREKENINGEN_LIST}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <Calculator className="h-5 w-5 flex-shrink-0" />
          {t('nav.loonberekening')}
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
            'text-gray-400 hover:bg-white/5 hover:text-white transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {t('nav.afmelden')}
        </button>
      </div>
    </aside>
  )
}
