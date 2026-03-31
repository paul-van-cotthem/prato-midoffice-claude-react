import { Link } from 'react-router-dom'
import { User, FileText, Calculator, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLoonberekening } from '@/hooks/useLoonberekening'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ArbeidstijdKalender } from './ArbeidstijdKalender'
import { BrutoNettoBerekening } from './BrutoNettoBerekening'
import { MeldingenPanel } from './MeldingenPanel'
import { VerloftellersPanel } from './VerloftellersPanel'
import { VoorschotPanel } from './VoorschotPanel'
import { OpmerkingPanel } from './OpmerkingPanel'
import type { LonenOverzichtRij } from '@/types/types'
import {
  persoonPath,
  contractPath,
  loonberekeningPath,
} from '@/config/routes'

interface Props {
  rij: LonenOverzichtRij
  werkgeverId: string
  onClose: () => void
}

export function DetailPanel({ rij, werkgeverId, onClose }: Props) {
  const { data: lb, isLoading } = useLoonberekening(rij.loonberekeningReferentieId)

  const volledigeNaam = `${rij.familieNaam} ${rij.voornaam}`

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">{volledigeNaam}</h2>
            <span className="font-mono text-xs text-gray-500">{rij.persoonReferentieId}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
            <span>
              Contract:{' '}
              <span className="font-mono font-medium">{rij.contractReferentieId}</span>
            </span>
            <span>
              Loonperiode:{' '}
              <span className="font-medium">{rij.loonperiode}</span>
            </span>
          </div>
          <nav aria-label="Snelkoppelingen" className="flex flex-wrap gap-2 pt-1">
            <Button variant="outline" size="sm" asChild>
              <Link to={persoonPath(werkgeverId, rij.persoonReferentieId)}>
                <User aria-hidden="true" />
                Persoon
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={contractPath(werkgeverId, rij.contractReferentieId)}>
                <FileText aria-hidden="true" />
                Contract
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={loonberekeningPath(werkgeverId, rij.loonberekeningReferentieId)}>
                <Calculator aria-hidden="true" />
                Loonberekening
              </Link>
            </Button>
          </nav>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Detailpaneel sluiten"
          className="shrink-0"
        >
          <X aria-hidden="true" />
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : lb === undefined ? (
        <p className="py-8 text-center text-sm text-gray-500">
          Loonberekening niet gevonden.
        </p>
      ) : (
        <Tabs defaultValue="arbeidstijd">
          <TabsList className="flex-wrap">
            <TabsTrigger value="arbeidstijd">Arbeidstijd</TabsTrigger>
            <TabsTrigger value="berekening">Berekening</TabsTrigger>
            <TabsTrigger value="meldingen" className="gap-1.5">
              Meldingen
              {rij.aantalBlokkerende > 0 && (
                <Badge variant="destructive" aria-label={`${rij.aantalBlokkerende} blokkerende`}>
                  {rij.aantalBlokkerende}
                </Badge>
              )}
              {rij.aantalBlokkerende === 0 && rij.aantalWaarschuwende > 0 && (
                <Badge
                  className="bg-amber-500 text-white"
                  aria-label={`${rij.aantalWaarschuwende} waarschuwende`}
                >
                  {rij.aantalWaarschuwende}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="verlof">Verlof</TabsTrigger>
            <TabsTrigger value="voorschot">Voorschot</TabsTrigger>
            <TabsTrigger value="opmerkingen">Opmerkingen</TabsTrigger>
          </TabsList>

          <TabsContent value="arbeidstijd">
            <ErrorBoundary>
              <ArbeidstijdKalender
                arbeidstijdgegevens={lb.Arbeidstijdgegevens}
                loonperiode={lb.Loonperiode}
              />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="berekening">
            <ErrorBoundary>
              <BrutoNettoBerekening lb={lb} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="meldingen">
            <ErrorBoundary>
              <MeldingenPanel meldingen={lb.Meldingen} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="verlof">
            <ErrorBoundary>
              <VerloftellersPanel />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="voorschot">
            <ErrorBoundary>
              <VoorschotPanel lb={lb} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="opmerkingen">
            <ErrorBoundary>
              <OpmerkingPanel opmerkingen={lb.Opmerkingen} />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
