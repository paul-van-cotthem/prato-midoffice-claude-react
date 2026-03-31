import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/config/routes'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center px-6">
        {t('common.pagina_niet_gevonden')}
      </p>
      <Link
        to={ROUTES.WERKGEVERS}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t('fout.terug_werkgevers')}
      </Link>
    </div>
  )
}
