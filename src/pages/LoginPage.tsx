import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

export default function LoginPage() {
  const { t } = useTranslation()
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      void navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  function handleLogin() {
    login()
    void navigate(ROUTES.DASHBOARD, { replace: true })
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg-page)' }}
    >
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="prato-card text-center">
          {/* Logo / Brand */}
          <div className="mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {t('login.titel')}
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {t('login.ondertitel')}
            </p>
          </div>

          {/* Login button */}
          <Button
            onClick={handleLogin}
            className="w-full"
            size="lg"
            style={{
              backgroundColor: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            }}
          >
            {t('login.inloggen')}
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {t('login.titel')}
        </p>
      </div>
    </div>
  )
}
