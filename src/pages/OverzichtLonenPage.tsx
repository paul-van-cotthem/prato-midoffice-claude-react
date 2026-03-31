import { useState, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Column,
} from '@tanstack/react-table'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  CalendarDays,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLonen, useUpdateLoonStatus } from '@/hooks/useLonen'
import { DetailPanel } from '@/components/overzicht/DetailPanel/DetailPanel'
import { Skeleton } from '@/components/ui/skeleton'
import { werkgeverPath } from '@/config/routes'
import type { LonenOverzichtRij, LoonStatus } from '@/types/types'

// ─── SortableHeader ──────────────────────────────────────────────────────────

function SortableHeader({
  column,
  label,
}: {
  column: Column<LonenOverzichtRij, unknown>
  label: string
}) {
  const sorted = column.getIsSorted()
  return (
    <button
      className="flex items-center gap-1 font-semibold hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {label}
      {sorted === 'asc' ? (
        <ChevronUp className="h-3 w-3" />
      ) : sorted === 'desc' ? (
        <ChevronDown className="h-3 w-3" />
      ) : (
        <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  )
}

// ─── StatusSelect ─────────────────────────────────────────────────────────────

const LOON_STATUSSEN: LoonStatus[] = [
  'TeBerekenen',
  'TeControleren',
  'Klaargezet',
  'Afgesloten',
  'Betaald',
]

function StatusSelect({
  rij,
  onUpdate,
}: {
  rij: LonenOverzichtRij
  onUpdate: (id: string, s: LoonStatus) => void
}) {
  const { t } = useTranslation()
  const statusLabels: Record<LoonStatus, string> = {
    TeBerekenen: t('status_badge.TeBerekenen', 'Te berekenen'),
    TeControleren: t('status_badge.TeControleren', 'Te controleren'),
    Klaargezet: t('status_badge.Klaargezet', 'Klaargezet'),
    Afgesloten: t('status_badge.Afgesloten', 'Afgesloten'),
    Betaald: t('status_badge.Betaald', 'Betaald'),
  }
  return (
    <select
      value={rij.status}
      onChange={(e) => onUpdate(rij.loonberekeningReferentieId, e.target.value as LoonStatus)}
      onClick={(e) => e.stopPropagation()}
      className="rounded border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
      style={{ minWidth: '130px' }}
    >
      {LOON_STATUSSEN.map((s) => (
        <option key={s} value={s}>
          {statusLabels[s]}
        </option>
      ))}
    </select>
  )
}

// ─── OverzichtLonenPage ───────────────────────────────────────────────────────

export default function OverzichtLonenPage() {
  const { t } = useTranslation()
  const { werkgeverReferentieId } = useParams<{ werkgeverReferentieId: string }>()
  const werkgeverId = werkgeverReferentieId ?? ''

  const [searchParams, setSearchParams] = useSearchParams()
  const van = searchParams.get('van') ?? '2025-01-01'
  const tot = searchParams.get('tot') ?? '2025-01-31'

  const [selectedRij, setSelectedRij] = useState<LonenOverzichtRij | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const { data: rijen = [], isLoading, isError, error } = useLonen(werkgeverId, van, tot)
  const statusMutation = useUpdateLoonStatus()

  function handleRowClick(rij: LonenOverzichtRij) {
    setSelectedRij(rij)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('persoonId', rij.persoonReferentieId)
      return next
    })
  }

  function handlePanelClose() {
    setSelectedRij(null)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('persoonId')
      return next
    })
  }

  function handleVanChange(newVan: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('van', newVan)
      return next
    })
  }

  function handleTotChange(newTot: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('tot', newTot)
      return next
    })
  }

  const columns: ColumnDef<LonenOverzichtRij>[] = useMemo(
    () => [
    {
      accessorKey: 'persoonReferentieId',
      header: t('persoon.referentie_id'),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.persoonReferentieId}
        </span>
      ),
    },
    {
      id: 'naam',
      header: ({ column }) => <SortableHeader column={column} label={t('lonen.col_naam')} />,
      accessorFn: (row) => `${row.familieNaam} ${row.voornaam}`,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.familieNaam} {row.original.voornaam}
        </span>
      ),
    },
    {
      accessorKey: 'arbeidsstelsel',
      header: ({ column }) => <SortableHeader column={column} label={t('contract.veld_statuut')} />,
      cell: ({ row }) => <span className="text-sm">{row.original.arbeidsstelsel}</span>,
    },
    {
      id: 'meldingen',
      header: t('loonberekening.sectie_meldingen'),
      cell: ({ row }) => {
        const { aantalBlokkerende, aantalWaarschuwende } = row.original
        if (aantalBlokkerende === 0 && aantalWaarschuwende === 0) {
          return <span className="text-xs text-gray-400">—</span>
        }
        return (
          <div className="flex gap-1">
            {aantalBlokkerende > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                {aantalBlokkerende} blokk.
              </span>
            )}
            {aantalWaarschuwende > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {aantalWaarschuwende} waarsch.
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} label={t('lonen.col_status')} />,
      cell: ({ row }) => (
        <StatusSelect
          rij={row.original}
          onUpdate={(id, status) => statusMutation.mutate({ id, status })}
        />
      ),
    },
    ],
    [t, statusMutation]
  )

  const table = useReactTable({
    data: rijen,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to={werkgeverPath(werkgeverId)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('lonen.terug')}
        </Link>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <h1 className="flex items-center gap-2 text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            <CalendarDays className="h-5 w-5" aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
            {t('lonen.titel')}
          </h1>

          {/* Period filter */}
          <form
            className="flex flex-wrap items-center gap-2 text-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="lonen-van" className="font-medium">
              {t('lonen.periode_label')}
            </label>
            <input
              id="lonen-van"
              type="date"
              value={van}
              onChange={(e) => handleVanChange(e.target.value)}
              className="rounded border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              id="lonen-tot"
              type="date"
              value={tot}
              onChange={(e) => handleTotChange(e.target.value)}
              className="rounded border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </form>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <p
          role="alert"
          className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error instanceof Error ? error.message : t('common.fout')}
        </p>
      )}

      {/* Main content: table + optional detail panel */}
      <div className="flex gap-4">
        {/* Table */}
        <div className="min-w-0 flex-1">
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  // Skeleton rows
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {columns.map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rijen.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      {t('lonen.geen_lonen')}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row.original)}
                      className={cn(
                        'cursor-pointer border-b transition-colors hover:bg-blue-50',
                        selectedRij?.loonberekeningReferentieId ===
                          row.original.loonberekeningReferentieId
                          ? 'bg-blue-50'
                          : 'bg-white',
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selectedRij !== null && (
          <div className="w-[480px] flex-shrink-0">
            <DetailPanel
              rij={selectedRij}
              werkgeverId={werkgeverId}
              onClose={handlePanelClose}
            />
          </div>
        )}
      </div>
    </div>
  )
}
