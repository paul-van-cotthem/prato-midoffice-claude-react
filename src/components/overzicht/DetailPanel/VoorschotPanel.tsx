import type { LoonberekeningBepaald } from '@/types/types'
import { formatCurrency } from '@/utils/formatUtils'

interface Props {
  lb: LoonberekeningBepaald
}

export function VoorschotPanel({ lb }: Props) {
  if (lb.VoorschotBedrag === null) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        <p className="font-medium">Geen voorschot geregistreerd</p>
        <p className="mt-1">Er is geen voorschot voor deze loonperiode.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-gray-200 bg-white p-4">
        <dl className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <dt className="text-gray-600">Voorschotbedrag</dt>
            <dd
              className="font-semibold tabular-nums text-gray-900"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCurrency(lb.VoorschotBedrag)}
            </dd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <dt className="text-gray-600">Voorschot betaald</dt>
            <dd>
              {lb.VoorschotBetaald ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                  Ja
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                  Nee
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
