import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import type { Melding } from '@/types/types'

interface Props {
  meldingen: readonly Melding[]
}

export function MeldingenPanel({ meldingen }: Props) {
  const blokkerende = meldingen.filter((m) => m.Severity === 'Blokkerend')
  const waarschuwende = meldingen.filter((m) => m.Severity === 'Waarschuwend')

  const sorted = [...blokkerende, ...waarschuwende]

  function buildSummary(): string {
    if (meldingen.length === 0) return 'Geen meldingen'
    const parts: string[] = []
    if (blokkerende.length > 0) {
      parts.push(
        `${blokkerende.length} blokkerende melding${blokkerende.length > 1 ? 'en' : ''}`,
      )
    }
    if (waarschuwende.length > 0) {
      parts.push(
        `${waarschuwende.length} waarschuwende melding${waarschuwende.length > 1 ? 'en' : ''}`,
      )
    }
    return parts.join(', ')
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">{buildSummary()}</p>

      {sorted.length === 0 ? (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Geen meldingen gevonden voor deze loonberekening.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((melding, idx) => {
            const isBlokkerend = melding.Severity === 'Blokkerend'
            return (
              <div
                key={idx}
                role="alert"
                className={
                  isBlokkerend
                    ? 'flex gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3'
                    : 'flex gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3'
                }
              >
                {isBlokkerend ? (
                  <XCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                    aria-label="Blokkerend"
                  />
                ) : (
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                    aria-label="Waarschuwend"
                  />
                )}
                <div className="space-y-0.5 text-sm">
                  <p
                    className={
                      isBlokkerend
                        ? 'font-mono font-semibold text-red-700'
                        : 'font-mono font-semibold text-amber-700'
                    }
                  >
                    {melding.Code}
                  </p>
                  <p className={isBlokkerend ? 'text-red-800' : 'text-amber-800'}>
                    {melding.Omschrijving}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
