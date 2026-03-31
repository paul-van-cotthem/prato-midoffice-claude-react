import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { fetchBerichten, clearBerichten, type BerichtLogEntry } from '@/lib/mock/berichten.mock'
import { BerichtPreview } from '@/components/common/BerichtPreview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// ─── Type Badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: BerichtLogEntry['type'] }) {
  const { t } = useTranslation()
  const config: Record<BerichtLogEntry['type'], { labelKey: string; className: string }> = {
    WerkgeverGewijzigd: { labelKey: 'berichten.type_werkgever', className: 'bg-blue-100 text-blue-800' },
    PersoonGewijzigd: { labelKey: 'berichten.type_persoon', className: 'bg-green-100 text-green-800' },
    ContractGewijzigd: { labelKey: 'berichten.type_contract', className: 'bg-purple-100 text-purple-800' },
    LoonberekeningBepaald: { labelKey: 'berichten.type_loonberekening', className: 'bg-orange-100 text-orange-800' },
  }
  const c = config[type]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.className}`}
    >
      {t(c.labelKey)}
    </span>
  )
}

// ─── Sort indicator ───────────────────────────────────────────────────────────

function SortIndicator({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'asc') return <span className="ml-1 opacity-70">↑</span>
  if (direction === 'desc') return <span className="ml-1 opacity-70">↓</span>
  return <span className="ml-1 opacity-30">↕</span>
}

// ─── ALL_TYPES sentinel ───────────────────────────────────────────────────────

const ALL_TYPES_VALUE = '__alle__'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BerichtenPage() {
  const { t } = useTranslation()
  const [berichten, setBerichten] = useState<BerichtLogEntry[]>([])
  const [filterType, setFilterType] = useState<string>(ALL_TYPES_VALUE)
  const [filterSearch, setFilterSearch] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<BerichtLogEntry | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }])

  useEffect(() => {
    setBerichten(fetchBerichten())
  }, [])

  // ── Statistics ───────────────────────────────────────────────────────────────

  const counts = useMemo(() => ({
    WerkgeverGewijzigd: berichten.filter((b) => b.type === 'WerkgeverGewijzigd').length,
    PersoonGewijzigd: berichten.filter((b) => b.type === 'PersoonGewijzigd').length,
    ContractGewijzigd: berichten.filter((b) => b.type === 'ContractGewijzigd').length,
    LoonberekeningBepaald: berichten.filter((b) => b.type === 'LoonberekeningBepaald').length,
  }), [berichten])

  // ── Filtering ────────────────────────────────────────────────────────────────

  const filteredBerichten = useMemo(() => {
    return berichten.filter((entry) => {
      const matchesType = filterType === ALL_TYPES_VALUE || entry.type === filterType
      const searchLower = filterSearch.toLowerCase()
      const matchesSearch =
        filterSearch === '' ||
        entry.entiteitNaam.toLowerCase().includes(searchLower) ||
        entry.entiteitId.toLowerCase().includes(searchLower)
      return matchesType && matchesSearch
    })
  }, [berichten, filterType, filterSearch])

  // ─── Columns (Memoized) ──────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<BerichtLogEntry>[]>(() => [
    {
      id: 'timestamp',
      accessorKey: 'timestamp',
      header: t('berichten.col_tijdstip'),
      enableSorting: true,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <span className="font-variant-numeric tabular-nums text-sm">
            {format(new Date(val), 'dd/MM/yyyy HH:mm:ss')}
          </span>
        )
      },
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: t('berichten.col_type'),
      enableSorting: true,
      cell: ({ getValue }) => <TypeBadge type={getValue<BerichtLogEntry['type']>()} />,
    },
    {
      id: 'entiteitNaam',
      accessorKey: 'entiteitNaam',
      header: t('berichten.col_naam'),
      enableSorting: true,
    },
    {
      id: 'entiteitId',
      accessorKey: 'entiteitId',
      header: t('berichten.col_entiteit_id'),
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      id: 'acties',
      header: t('berichten.col_acties'),
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('[DEBUG] Opening JSON for:', row.original.entiteitId)
            setSelectedEntry(row.original)
            setShowSheet(true)
          }}
        >
          {t('berichten.bekijk_json')}
        </Button>
      ),
    },
  ], [t])

  const table = useReactTable({
    data: filteredBerichten,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleClearConfirm() {
    clearBerichten()
    setBerichten(fetchBerichten())
    setShowClearDialog(false)
  }

  // ── Empty state logic ─────────────────────────────────────────────────────────

  const hasAnyBerichten = berichten.length > 0
  const hasFilteredResults = filteredBerichten.length > 0
  const tableRows = table.getRowModel().rows

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-6 bg-prato-bg">
      {/* Header card */}
      <div className="prato-card mb-6 p-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-prato-blue" />
          <div>
            <h1 className="text-xl font-bold text-prato-blue">{t('berichten.titel')}</h1>
            <p className="text-sm text-prato-text-muted mt-0.5">
              {t('berichten.ondertitel')}
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="prato-card mb-6 p-4 border-t-0 border border-prato-border">
        <div className="flex flex-row gap-4 items-center">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-52" aria-label={t('berichten.filter_alle_types')}>
              <SelectValue placeholder={t('berichten.filter_alle_types')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TYPES_VALUE}>{t('berichten.filter_alle_types')}</SelectItem>
              <SelectItem value="PersoonGewijzigd">{t('berichten.type_persoon')}</SelectItem>
              <SelectItem value="ContractGewijzigd">{t('berichten.type_contract')}</SelectItem>
              <SelectItem value="WerkgeverGewijzigd">{t('berichten.type_werkgever')}</SelectItem>
              <SelectItem value="LoonberekeningBepaald">{t('berichten.type_loonberekening')}</SelectItem>
            </SelectContent>
          </Select>

          <Input
            className="max-w-xs"
            placeholder={t('berichten.zoek_placeholder')}
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            aria-label={t('berichten.zoek_placeholder')}
          />

          <Button
            variant="destructive"
            className="ml-auto"
            onClick={() => setShowClearDialog(true)}
            disabled={berichten.length === 0}
          >
            {t('berichten.log_wissen')}
          </Button>
        </div>
      </div>

      {/* Statistics row */}
      <div className="flex gap-4 mb-4 flex-wrap items-center px-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          {t('berichten.type_werkgever')}{' '}
          <span className="bg-white/50 px-1.5 rounded">{counts.WerkgeverGewijzigd}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          {t('berichten.type_persoon')}{' '}
          <span className="bg-white/50 px-1.5 rounded">{counts.PersoonGewijzigd}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
          {t('berichten.type_contract')}{' '}
          <span className="bg-white/50 px-1.5 rounded">{counts.ContractGewijzigd}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
          {t('berichten.type_loonberekening')}{' '}
          <span className="bg-white/50 px-1.5 rounded">{counts.LoonberekeningBepaald}</span>
        </span>
        <span className="text-sm text-prato-text-muted ml-auto mr-1">
          {t('berichten.totaal')}:{' '}
          <span className="font-bold text-prato-text">
            {berichten.length}
          </span>
        </span>
      </div>

      {/* Table card */}
      <div className="prato-card p-0 overflow-hidden border-t-0 border border-prato-border">
        {!hasAnyBerichten ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-prato-text-muted">
            <MessageSquare className="h-12 w-12 opacity-20" />
            <p className="text-base text-center max-w-sm">
              {t('berichten.geen_berichten')}
            </p>
          </div>
        ) : !hasFilteredResults ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-prato-text-muted">
            <p className="text-base">{t('berichten.geen_resultaten')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 border-b border-prato-border z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort()
                      const sortDir = header.column.getIsSorted()
                      return (
                        <th
                          key={header.id}
                          className={cn(
                            'px-4 py-3 text-left font-semibold text-prato-text select-none uppercase tracking-wider text-[10px]',
                            canSort && 'cursor-pointer hover:bg-gray-100'
                          )}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          <span className="inline-flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && <SortIndicator direction={sortDir} />}
                          </span>
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-prato-border bg-white hover:bg-blue-50/50 transition-colors duration-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-prato-text">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BerichtPreview sheet (Always mounted if entry exists to prevent animation flickering) */}
      <BerichtPreview
        entry={selectedEntry}
        open={showSheet && selectedEntry !== null}
        onClose={() => setShowSheet(false)}
      />

      {/* AlertDialog: Log wissen */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="prato-dialog-content">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('berichten.log_wissen_titel')}</AlertDialogTitle>
            <AlertDialogDescription className="text-prato-text-muted">
              {t('berichten.log_wissen_beschrijving')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-prato-border text-prato-text hover:bg-gray-100">
              {t('common.annuleren')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('berichten.log_wissen')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
