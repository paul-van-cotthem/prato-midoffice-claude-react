import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { buildSnapshotRanges, formatDate } from '@/utils/dateUtils'

interface Props<T extends { AanvangsDatum: string }> {
  snapshots: readonly T[]
  activeIndex: number
  onSelect: (index: number) => void
  className?: string
}

export function SnapshotTimeline<T extends { AanvangsDatum: string }>({
  snapshots,
  activeIndex,
  onSelect,
  className,
}: Props<T>) {
  const { t } = useTranslation()
  const ranges = buildSnapshotRanges(snapshots)

  if (ranges.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('common.niet_gevonden')}</p>
  }

  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      role="group"
      aria-label={t('werkgever.snapshot_tijdlijn')}
    >
      {ranges.map((range, i) => {
        const originalIndex = snapshots.indexOf(range.snapshot)
        const isActive = originalIndex === activeIndex
        const isLast = i === ranges.length - 1
        const label = `${formatDate(range.from)} \u2013 ${range.to ? formatDate(range.to) : t('common.laden')}`

        return (
          <button
            key={range.from}
            type="button"
            aria-pressed={isActive}
            aria-label={`${t('snapshot_tijdlijn.aanvangsdatum')} ${label}`}
            onClick={() => onSelect(originalIndex)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium border transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-accent',
              isLast && 'font-semibold',
            )}
          >
            {label}
            {isLast && (
              <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                huidig
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
