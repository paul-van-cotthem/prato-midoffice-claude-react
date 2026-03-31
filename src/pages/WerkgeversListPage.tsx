import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table'
import { Building2, Plus, ChevronUp, ChevronDown, ChevronsUpDown, ArrowRight } from 'lucide-react'
import { useWerkgevers, useCreateWerkgever } from '@/hooks/useWerkgevers'
import { werkgeverPath } from '@/config/routes'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { DeleteButton } from '@/components/common/DeleteButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { WerkgeverGewijzigd } from '@/types/types'

// ─── Row shape ───────────────────────────────────────────────────────────────

interface WerkgeverRij {
  id: string
  naam: string
  ondernemingsNummer: string
  rszNummer: string
  gemeente: string
  original: WerkgeverGewijzigd
}

function toRij(w: WerkgeverGewijzigd): WerkgeverRij {
  const snap = w.WerkgeverSnapshots.at(-1)
  return {
    id: w.WerkgeverReferentieId,
    naam: snap?.MaatschappelijkeNaam ?? '—',
    ondernemingsNummer: snap?.OndernemingsNummer ?? '—',
    rszNummer: snap?.RSZNummer ?? '—',
    gemeente: snap?.Adres.Gemeente ?? '—',
    original: w,
  }
}

// ─── Sort icon helper ─────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'asc') return <ChevronUp className="h-3.5 w-3.5 ml-1 inline-block" />
  if (direction === 'desc') return <ChevronDown className="h-3.5 w-3.5 ml-1 inline-block" />
  return <ChevronsUpDown className="h-3.5 w-3.5 ml-1 inline-block opacity-50" />
}

// ─── Nieuw werkgever dialog form ──────────────────────────────────────────────

interface NieuwWerkgeverFormProps {
  onSuccess: (id: string) => void
  onClose: () => void
}

function NieuwWerkgeverForm({ onSuccess, onClose }: NieuwWerkgeverFormProps) {
  const { t } = useTranslation()
  const createMutation = useCreateWerkgever()
  const [naam, setNaam] = useState('')
  const [ondernemingsNummer, setOndernemingsNummer] = useState('')
  const [rszNummer, setRszNummer] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!naam.trim()) return

    const nieuwWerkgever: WerkgeverGewijzigd = {
      WerkgeverReferentieId: '',
      RecordDatum: new Date().toISOString(),
      WerkgeverSnapshots: [
        {
          AanvangsDatum: new Date().toISOString().slice(0, 10),
          MaatschappelijkeNaam: naam.trim(),
          OndernemingsNummer: ondernemingsNummer.trim(),
          RSZNummer: rszNummer.trim(),
          BTWNummer: null,
          RechtspersonenRegister: null,
          Vennootschapsvorm: null,
          Taal: 'Nederlands',
          Periodiciteit: 'Maandelijks',
          Adres: {
            Straat: '',
            Huisnummer: '',
            Bus: null,
            Gemeente: '',
            PostCode: '',
            Land: 'België',
          },
          Email: null,
          Telefoon: null,
          Website: null,
          IBAN: null,
          BIC: null,
          IBANLonen: null,
          BICLonen: null,
          ParitaireComites: [],
          BetaaltBvZelf: false,
          VrijstellingPloegenarbeid: false,
          VrijstellingNachtarbeid: false,
          VrijstellingVolContinu: false,
          VrijstellingOnroerendeStaat: false,
          ChequeLeverancier: null,
          WerkgeversbijdrageMaaltijdcheque: null,
          NotieCuratele: false,
          Erkenningsnummer: null,
          BegindatumVakantieperiode: null,
        },
      ],
    }

    createMutation.mutate(nieuwWerkgever, {
      onSuccess: (data) => {
        onClose()
        onSuccess(data.WerkgeverReferentieId)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nieuw-naam" className="text-sm font-semibold text-foreground">
            {t('werkgevers.naam_label')} *
          </label>
          <Input
            id="nieuw-naam"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            placeholder={t('werkgevers.naam_placeholder')}
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nieuw-on" className="text-sm font-semibold text-foreground">
              {t('werkgevers.col_ondernemingsnr')}
            </label>
            <Input
              id="nieuw-on"
              value={ondernemingsNummer}
              onChange={(e) => setOndernemingsNummer(e.target.value)}
              placeholder="0425.734.891"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nieuw-rsz" className="text-sm font-semibold text-foreground">
              {t('werkgevers.col_rsz')}
            </label>
            <Input
              id="nieuw-rsz"
              value={rszNummer}
              onChange={(e) => setRszNummer(e.target.value)}
              placeholder="5234789-12"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t mt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="px-6"
        >
          {t('common.annuleren')}
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || !naam.trim()}
          className="px-6 min-w-[120px] btn-primary"
        >
          {createMutation.isPending ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" className="text-white" />
              {t('common.aanmakenBezig')}
            </div>
          ) : (
            t('common.aanmaken')
          )}
        </Button>
      </div>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WerkgeversListPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data, isLoading, isError, error } = useWerkgevers()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('action') === 'new')

  // Clear query param when dialog closes to prevent reopening on refresh
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open && searchParams.has('action')) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('action')
      setSearchParams(newParams, { replace: true })
    }
  }
  const rows: WerkgeverRij[] = useMemo(() => (data ?? []).map(toRij), [data])

  const columns: ColumnDef<WerkgeverRij>[] = useMemo(
    () => [
    {
      accessorKey: 'naam',
      header: t('werkgevers.col_naam'),
      enableSorting: true,
    },
    {
      accessorKey: 'ondernemingsNummer',
      header: t('werkgevers.col_ondernemingsnr'),
      enableSorting: true,
    },
    {
      accessorKey: 'rszNummer',
      header: t('werkgevers.col_rsz'),
      enableSorting: true,
    },
    {
      accessorKey: 'gemeente',
      header: t('werkgevers.col_gemeente'),
      enableSorting: true,
    },
    {
      id: 'acties',
      header: t('werkgevers.col_acties'),
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => void navigate(werkgeverPath(row.original.id))}
            aria-label={`${t('common.details')} ${row.original.naam}`}
          >
            {t('common.details')}
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
          <DeleteButton />
        </div>
      ),
    },
    ],
    [t, navigate]
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  function handleNewWerkgeverSuccess(id: string) {
    void navigate(werkgeverPath(id))
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : t('common.fout')}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const currentPage = pageIndex + 1

  return (
    <div className="min-h-screen p-6 bg-[var(--color-bg-page)]">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-prato-blue" />
          <h1 className="text-2xl font-bold text-prato-blue">
            {t('werkgevers.titel')}
          </h1>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <Button 
            className="btn-primary"
            onClick={() => {
              console.log('[DEBUG] Opening New Employer Dialog')
              setDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('werkgevers.nieuw')}
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('werkgevers.nieuw_dialog_titel')}</DialogTitle>
            </DialogHeader>
            <NieuwWerkgeverForm
              onSuccess={handleNewWerkgeverSuccess}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Card */}
      <div className="prato-card p-0 overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-border">
          <Input
            placeholder={t('werkgevers.zoeken_placeholder')}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
            aria-label={t('werkgevers.zoeken_placeholder')}
          />
        </div>

        {/* Empty state */}
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
            <Building2 className="h-10 w-10 opacity-30" />
            <p className="text-base">{t('werkgevers.geen')}</p>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              {t('werkgevers.eerste_toevoegen')}
            </Button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white border-b border-border z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort()
                        const sortDir = header.column.getIsSorted()
                        return (
                          <th
                            key={header.id}
                            className={cn(
                              'px-4 py-3 text-left font-medium text-foreground select-none',
                              canSort && 'cursor-pointer hover:text-primary',
                            )}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                            aria-sort={
                              sortDir === 'asc'
                                ? 'ascending'
                                : sortDir === 'desc'
                                  ? 'descending'
                                  : undefined
                            }
                          >
                            {header.isPlaceholder ? null : (
                              <span className="inline-flex items-center">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {canSort && <SortIcon direction={sortDir} />}
                              </span>
                            )}
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border bg-white hover:bg-blue-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-foreground">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {t('common.pagina_van', { huidig: currentPage, totaal: pageCount })}
                  {' '}
                  <span className="tabular-nums">
                    {t('common.items_van', {
                      van: pageIndex * pageSize + 1,
                      tot: Math.min((pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length),
                      totaal: table.getFilteredRowModel().rows.length,
                    })}
                  </span>
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {t('common.vorige')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {t('common.volgende')}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
