import type { BerekeningsStap, LoonberekeningBepaald } from '@/types/types'
import { formatCurrency } from '@/utils/formatUtils'
import { cn } from '@/lib/utils'

interface Props {
  lb: LoonberekeningBepaald
}

interface StapSectionProps {
  stap: BerekeningsStap
  highlight?: boolean
}

function StapSection({ stap, highlight = false }: StapSectionProps) {
  return (
    <div
      className={cn(
        'rounded-md border p-3',
        highlight ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white',
      )}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
        {stap.Naam}
      </p>
      <div className="space-y-1">
        {stap.Regels.map((regel, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-center justify-between gap-2 text-sm',
              regel.IsTotaal && 'border-t border-gray-200 pt-1 font-semibold',
            )}
          >
            <span className={cn('text-gray-700', regel.IsTotaal && 'text-gray-900')}>
              {regel.Omschrijving}
            </span>
            <span
              className={cn(
                'tabular-nums text-gray-700',
                regel.IsTotaal && 'text-base text-gray-900',
              )}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCurrency(regel.Bedrag)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface RunningTotalProps {
  label: string
  amount: number
}

function RunningTotal({ label, amount }: RunningTotalProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-xs text-gray-500">
      <span className="text-gray-400">↓</span>
      <span>{label}</span>
      <span className="font-semibold tabular-nums text-gray-700" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatCurrency(amount)}
      </span>
    </div>
  )
}

export function BrutoNettoBerekening({ lb }: Props) {
  const mainStappen: Array<{ stap: BerekeningsStap; label: string; highlight?: boolean }> = [
    { stap: lb.BrutoLoonBerekening, label: 'Na bruto' },
    { stap: lb.RSZBerekening, label: 'Na RSZ' },
    { stap: lb.BelastbaarInkomenBerekening, label: 'Belastbaar' },
    { stap: lb.BVBerekening, label: 'Na BV' },
    { stap: lb.BBSZBerekening, label: 'Na BBSZ' },
    { stap: lb.NettoLoonBerekening, label: 'Netto', highlight: true },
  ]

  return (
    <div className="space-y-2">
      {mainStappen.map(({ stap, label, highlight }, idx) => (
        <div key={stap.Naam}>
          <StapSection stap={stap} highlight={highlight} />
          {idx < mainStappen.length - 1 && (
            <RunningTotal label={label} amount={stap.Totaal} />
          )}
        </div>
      ))}

      {lb.LoonbeslagBerekeningen.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Loonbeslag
          </p>
          <div className="space-y-1">
            {lb.LoonbeslagBerekeningen.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-gray-700">{item.Omschrijving}</span>
                <span
                  className="tabular-nums text-gray-700"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatCurrency(item.Bedrag)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lb.WerkuitkeringBerekening !== null && (
        <div className="rounded-md border border-sky-200 bg-sky-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
            Werkuitkering
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-600">Instelling</span>
              <span className="text-gray-800">{lb.WerkuitkeringBerekening.Instelling}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-600">Bedrag</span>
              <span
                className="tabular-nums text-gray-800"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatCurrency(lb.WerkuitkeringBerekening.Bedrag)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-600">Periode</span>
              <span className="text-gray-800">{lb.WerkuitkeringBerekening.Periode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
