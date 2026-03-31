import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Users, ArrowRight, UserPlus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { persoonPath } from '@/config/routes'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { PersoonGewijzigd } from '@/types/types'

export default function PersonenListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const { data, isLoading } = useQuery({
    queryKey: ['personen-global'],
    queryFn: async () => {
      const { personenData } = await import('@/lib/mock/data/personen');
      return personenData as PersoonGewijzigd[];
    }
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<PersoonGewijzigd>[] = useMemo(
    () => [
    {
      id: 'naam',
      header: t('persoon.veld_familieNaam'),
      accessorFn: (row) => `${row.PersoonSnapshots.at(-1)?.FamilieNaam} ${row.PersoonSnapshots.at(-1)?.Voornaam}`,
    },
    {
      id: 'insz',
      header: t('persoon.veld_inszNummer'),
      accessorFn: (row) => row.PersoonSnapshots.at(-1)?.INSZNummer ?? '',
    },
    {
      id: 'gemeente',
      header: t('persoon.veld_gemeente'),
      accessorFn: (row) => row.PersoonSnapshots.at(-1)?.Gemeente ?? '',
    },
    {
      id: 'acties',
      header: t('werkgevers.col_acties'),
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(persoonPath(row.original.WerkgeverReferentieId, row.original.PersoonReferentieId))}
        >
          {t('common.details')}
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
    }
    ],
    [t, navigate]
  )

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>

  return (
    <div className="p-6 min-h-screen bg-[var(--color-bg-page)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">{t('nav.personen')}</h1>
        </div>
        <Button disabled>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('common.toevoegen')}
        </Button>
      </div>

      <div className="prato-card p-0">
        <div className="p-4 border-b">
          <Input
            placeholder={t('common.zoeken')}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id} className="px-4 py-3 text-left font-medium">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
