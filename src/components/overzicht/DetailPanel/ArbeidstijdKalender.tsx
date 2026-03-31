import { getDaysInMonth, format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Arbeidstijdgegeven, AfwezigheidsType } from '@/types/types'

interface Props {
  arbeidstijdgegevens: readonly Arbeidstijdgegeven[]
  loonperiode: string // "2025-01"
}

const DAY_HEADERS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

const afwezigheidsKleur: Record<AfwezigheidsType, string> = {
  Vakantie: 'bg-blue-100 text-blue-800',
  Ziekte: 'bg-red-100 text-red-800',
  FeestdagWettelijk: 'bg-purple-100 text-purple-800',
  VerlofdagExtra: 'bg-indigo-100 text-indigo-800',
  Tijdskrediet: 'bg-yellow-100 text-yellow-800',
  Arbeidsongeval: 'bg-orange-100 text-orange-800',
  BeroepsZiekte: 'bg-rose-100 text-rose-800',
  Moederschapsverlof: 'bg-pink-100 text-pink-800',
  Vaderschapsverlof: 'bg-cyan-100 text-cyan-800',
  Ouderschapsverlof: 'bg-teal-100 text-teal-800',
}

const afwezigheidsLabel: Record<AfwezigheidsType, string> = {
  Vakantie: 'Vak',
  Ziekte: 'Ziek',
  FeestdagWettelijk: 'FD',
  VerlofdagExtra: 'VE',
  Tijdskrediet: 'TK',
  Arbeidsongeval: 'AO',
  BeroepsZiekte: 'BZ',
  Moederschapsverlof: 'MV',
  Vaderschapsverlof: 'VV',
  Ouderschapsverlof: 'OV',
}

// Map JS Date.getDay() (0=Sun…6=Sat) to Monday-first column index (0=Mon…6=Sun)
function toMondayFirst(jsDay: number): number {
  return (jsDay + 6) % 7
}

export function ArbeidstijdKalender({ arbeidstijdgegevens, loonperiode }: Props) {
  const parts = loonperiode.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])

  // Build lookup map: 'YYYY-MM-DD' -> Arbeidstijdgegeven
  const dataMap = new Map<string, Arbeidstijdgegeven>()
  for (const atg of arbeidstijdgegevens) {
    dataMap.set(atg.Datum, atg)
  }

  const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1))
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const startOffset = toMondayFirst(firstDayOfMonth.getDay())

  // Build flat cell array: nulls for leading empty slots, then day numbers
  const cells: Array<number | null> = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad to complete final row
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  // Collect afwezigheid types present in data for legend
  const presentTypes = new Set<AfwezigheidsType>()
  for (const atg of arbeidstijdgegevens) {
    if (atg.AfwezigheidsType !== null) {
      presentTypes.add(atg.AfwezigheidsType)
    }
  }

  function getCellClass(day: number, colIndex: number): string {
    const isWeekend = colIndex >= 5
    if (isWeekend) return 'bg-gray-100 text-gray-500'

    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const atg = dataMap.get(dateKey)

    if (!atg) return 'bg-gray-50 text-gray-400'
    if (atg.AfwezigheidsType !== null) return afwezigheidsKleur[atg.AfwezigheidsType]
    if (atg.UrenGewerkt !== null && atg.UrenGewerkt > 0) return 'bg-green-100 text-green-800'
    return 'bg-gray-50 text-gray-400'
  }

  function getCellContent(day: number, colIndex: number): string {
    const isWeekend = colIndex >= 5
    if (isWeekend) return String(day)

    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const atg = dataMap.get(dateKey)

    if (!atg) return String(day)
    if (atg.AfwezigheidsType !== null) return afwezigheidsLabel[atg.AfwezigheidsType]
    if (atg.UrenGewerkt !== null && atg.UrenGewerkt > 0) return `${atg.UrenGewerkt}u`
    return String(day)
  }

  const rows: Array<Array<number | null>> = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7) as Array<number | null>)
  }

  const monthLabel = format(new Date(year, month - 1, 1), 'MMMM yyyy', { locale: nl })

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium capitalize text-gray-700">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1">
        {DAY_HEADERS.map((h) => (
          <div
            key={h}
            className="flex items-center justify-center text-xs font-semibold text-gray-500"
          >
            {h}
          </div>
        ))}
        {rows.map((row, rowIdx) =>
          row.map((day, colIdx) => {
            if (day === null) {
              return <div key={`empty-${rowIdx}-${colIdx}`} />
            }
            return (
              <div
                key={`day-${day}`}
                className={cn(
                  'flex min-w-[36px] flex-col items-center justify-center rounded text-xs',
                  'h-12',
                  getCellClass(day, colIdx),
                )}
              >
                <span className="font-medium leading-none">{getCellContent(day, colIdx)}</span>
                {(() => {
                  const isWeekend = colIdx >= 5
                  if (isWeekend) return null
                  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const atg = dataMap.get(dateKey)
                  if (atg?.AfwezigheidsType === null && atg?.UrenGewerkt !== null) {
                    return (
                      <span className="mt-0.5 leading-none text-[10px] opacity-70">{day}</span>
                    )
                  }
                  return null
                })()}
              </div>
            )
          }),
        )}
      </div>

      {presentTypes.size > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {([...presentTypes] as AfwezigheidsType[]).map((type) => (
            <span
              key={type}
              className={cn(
                'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs',
                afwezigheidsKleur[type],
              )}
            >
              <span className="font-semibold">{afwezigheidsLabel[type]}</span>
              <span className="opacity-75">{type}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
