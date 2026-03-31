import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Users, FileText, Calculator, ArrowRight, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ROUTES } from '@/config/routes'
import { useWerkgevers } from '@/hooks/useWerkgevers'
import { fetchBerichten } from '@/lib/mock/berichten.mock'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // 1. Fetching data for KPIs
  const { data: werkgeversData, isLoading: loadingWerkgevers } = useWerkgevers()

  const { data: personenData, isLoading: loadingPersonen } = useQuery({
    queryKey: ['personen-global'],
    queryFn: async () => {
      const { personenData } = await import('@/lib/mock/data/personen')
      return personenData
    },
  })

  // We consider all contracts active for the MVP KPI
  const { data: contractenData, isLoading: loadingContracten } = useQuery({
    queryKey: ['contracten-global'],
    queryFn: async () => {
      const { contractenData } = await import('@/lib/mock/data/contracten')
      return contractenData
    },
  })

  const { data: loonberekeningenData, isLoading: loadingLonen } = useQuery({
    queryKey: ['loonberekeningen-global'],
    queryFn: async () => {
      const { loonberekeningenData } = await import('@/lib/mock/data/loonberekeningen')
      return loonberekeningenData
    },
  })

  // Get recent berichten (top 5)
  const berichten = fetchBerichten().slice(0, 5)

  // 2. Metrics Calculation
  const countWerkgevers = werkgeversData?.length || 0
  const countPersonen = personenData?.length || 0
  const countContracten = contractenData?.length || 0
  const countLonen = loonberekeningenData?.length || 0

  // Optional: Mock some "actions required" (e.g., failed syncs or expiring contracts)
  // For MVP, we'll list a static or inferred set of issues for realism.
  const actionItems = []
  if (countLonen > 0) {
    actionItems.push({
      id: 1,
      title: 'Er staan nog draft loonberekeningen open voor goedkeuring.',
      type: 'warning',
    })
  }

  return (
    <div className="min-h-screen p-6 bg-prato-bg space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-prato-blue">{t('dashboard.titel')}</h1>
          <p className="text-sm text-prato-text-muted mt-1">{t('dashboard.ondertitel')}</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <KPICard
          title={t('dashboard.kpi_werkgevers')}
          value={loadingWerkgevers ? null : countWerkgevers}
          icon={<Building2 className="h-5 w-5 text-blue-500" />}
          link={ROUTES.WERKGEVERS}
          actionLabel="Nieuwe werkgever"
          onAction={() => navigate(ROUTES.WERKGEVERS + '?action=new')}
        />
        <KPICard
          title={t('dashboard.kpi_actieve_personen')}
          value={loadingPersonen ? null : countPersonen}
          icon={<Users className="h-5 w-5 text-green-500" />}
          link={ROUTES.PERSONEN_LIST}
          actionLabel="Nieuwe persoon"
          onAction={() => navigate(ROUTES.PERSONEN_LIST + '?action=new')}
        />
        <KPICard
          title={t('dashboard.kpi_actieve_contracten')}
          value={loadingContracten ? null : countContracten}
          icon={<FileText className="h-5 w-5 text-purple-500" />}
          link={ROUTES.CONTRACTEN_LIST}
          actionLabel="Nieuw contract"
          onAction={() => navigate(ROUTES.CONTRACTEN_LIST + '?action=new')}
        />
        <KPICard
          title={t('dashboard.kpi_draft_loonberekeningen')}
          value={loadingLonen ? null : countLonen}
          icon={<Calculator className="h-5 w-5 text-orange-500" />}
          link={ROUTES.LOONBEREKENINGEN_LIST}
          actionLabel="Nieuwe berekening"
          onAction={() => navigate(ROUTES.LOONBEREKENINGEN_LIST + '?action=new')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions Required */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-prato-blue flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {t('dashboard.acties_titel')}
          </h2>
          <div className="prato-card p-0 overflow-hidden border border-prato-border">
            {actionItems.length === 0 ? (
              <div className="p-8 text-center text-prato-text-muted">
                <CheckCircle className="h-10 w-10 mx-auto text-green-500 mb-2 opacity-50" />
                <p>{t('dashboard.geen_acties')}</p>
              </div>
            ) : (
              <ul className="divide-y divide-prato-border">
                {actionItems.map((item) => (
                  <li key={item.id} className="p-4 flex items-start gap-3 bg-red-50/30">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-prato-text">{item.title}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LOONBEREKENINGEN_LIST)}>
                      Bekijken
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-prato-blue flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('dashboard.recente_activiteit_titel')}
          </h2>
          <div className="prato-card p-0 overflow-hidden border border-prato-border">
            {berichten.length === 0 ? (
              <div className="p-8 text-center text-prato-text-muted">
                <p>{t('dashboard.geen_activiteit')}</p>
              </div>
            ) : (
              <ul className="divide-y divide-prato-border">
                {berichten.map((b, idx) => (
                  <li key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-semibold text-prato-blue mb-1">{b.type}</p>
                    <p className="text-sm text-prato-text truncate mb-1" title={b.entiteitNaam}>
                      {b.entiteitNaam}
                    </p>
                    <p className="text-xs text-prato-text-muted">
                      {format(new Date(b.timestamp), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="p-3 border-t border-prato-border bg-gray-50 text-center">
              <Link
                to={ROUTES.BERICHTEN}
                className="text-sm font-medium text-prato-blue hover:underline flex items-center justify-center gap-1"
              >
                Volledig logboek <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({
  title,
  value,
  icon,
  link,
  actionLabel,
  onAction,
}: {
  title: string
  value: number | null
  icon: React.ReactNode
  link: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <Link
        to={link}
        className="prato-card hover:border-prato-blue/40 transition-colors flex items-center justify-between p-5 border border-prato-border/50 group flex-1"
      >
        <div>
          <p className="text-sm font-medium text-prato-text-muted mb-1">{title}</p>
          <div className="flex items-center gap-2">
            {value === null ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-bold text-prato-text">{value}</span>
            )}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
      </Link>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="w-full text-xs font-semibold py-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
