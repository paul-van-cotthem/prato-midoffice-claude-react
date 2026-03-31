import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { LoonStatus } from '@/types/types'

const statusClasses: Record<LoonStatus, string> = {
  TeBerekenen: 'bg-gray-100 text-gray-700',
  TeControleren: 'bg-orange-50 text-orange-700',
  Klaargezet: 'bg-blue-50 text-blue-700',
  Afgesloten: 'bg-green-50 text-green-700',
  Betaald: 'bg-green-900 text-white',
}

// Fallback labels voor status waarden die niet in vertaling staan
const statusFallbacks: Record<LoonStatus, string> = {
  TeBerekenen: 'Te berekenen',
  TeControleren: 'Te controleren',
  Klaargezet: 'Klaargezet',
  Afgesloten: 'Afgesloten',
  Betaald: 'Betaald',
}

interface Props {
  status: LoonStatus
  className?: string
}

export function StatusBadge({ status, className }: Props) {
  const { t } = useTranslation()
  const label = t(`status_badge.${status}`, statusFallbacks[status])
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[status],
        className,
      )}
    >
      {label}
    </span>
  )
}
