import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES, persoonPath } from '@/config/routes'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useWerkgevers } from '@/hooks/useWerkgevers'
import { useCreatePersoon } from '@/hooks/usePersonen'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { PersoonGewijzigd } from '@/types/types'

function NieuwPersoonForm({ onSuccess, onClose }: { onSuccess: (id: string, werkgeverId: string) => void, onClose: () => void }) {
  const { t } = useTranslation()
  const createMutation = useCreatePersoon()
  const { data: werkgevers } = useWerkgevers()

  const [werkgeverId, setWerkgeverId] = useState('')
  const [voornaam, setVoornaam] = useState('')
  const [familieNaam, setFamilieNaam] = useState('')
  const [insz, setInsz] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!werkgeverId || !voornaam.trim() || !familieNaam.trim()) return

    const nieuwPersoon: PersoonGewijzigd = {
      WerkgeverReferentieId: werkgeverId,
      PersoonReferentieId: '',
      RecordDatum: new Date().toISOString(),
      PersoonSnapshots: [
        {
          AanvangsDatum: new Date().toISOString().slice(0, 10),
          Werknemerskengetallen: [],
          DatumInDienst: null,
          GepensioneerdVanaf: null,
          Voornaam: voornaam.trim(),
          FamilieNaam: familieNaam.trim(),
          Geboortedatum: '1990-01-01',
          Geslacht: 'X',
          BurgerlijkeStaat: 'Ongehuwd',
          INSZNummer: insz.trim(),
          GeboortePlaats: '',
          Straat: '',
          Huisnummer: '',
          Bus: null,
          Gemeente: '',
          PostCode: '',
          Land: 'België',
          IBAN: null,
          BIC: null,
          TypeBvBerekening: null,
          VastBvPercentage: null,
          Mindervalide: false,
          PartnerInkomsten: 'GeenEigenInkomsten',
          PartnerMindervalide: false,
          AantalKinderenTenLaste: 0,
          AantalMindervalideKinderenTenLaste: 0,
          AantalOuderePersonenTenLaste: 0,
          AantalMindervalideOuderePersonenTenLaste: 0,
          AantalAnderePersonenTenLaste: 0,
          AantalAndereMindervalidePersonenTenLaste: 0,
          AantalZorgbehoevendeOuderePersonenTenLaste: 0,
          Taal: 'Nederlands',
          EmailLoonbrief: null,
        },
      ],
    }

    createMutation.mutate(nieuwPersoon, {
      onSuccess: (data) => {
        onSuccess(data.PersoonReferentieId, data.WerkgeverReferentieId)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">Werkgever</label>
        <Select value={werkgeverId} onValueChange={setWerkgeverId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecteer werkgever..." />
          </SelectTrigger>
          <SelectContent>
            {werkgevers?.map(w => (
              <SelectItem key={w.WerkgeverReferentieId} value={w.WerkgeverReferentieId}>
                {w.WerkgeverSnapshots.at(-1)?.MaatschappelijkeNaam || w.WerkgeverReferentieId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">{t('persoon.veld_voornaam', 'Voornaam')}</label>
        <Input value={voornaam} onChange={e => setVoornaam(e.target.value)} placeholder="Jan" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">{t('persoon.veld_familieNaam', 'Familienaam')}</label>
        <Input value={familieNaam} onChange={e => setFamilieNaam(e.target.value)} placeholder="Peeters" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">{t('persoon.veld_inszNummer', 'INSZ Nummer')}</label>
        <Input value={insz} onChange={e => setInsz(e.target.value)} placeholder="80.01.01-123.45" />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t mt-2">
        <Button type="button" variant="outline" onClick={onClose} className="px-6">
          {t('common.annuleren')}
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || !werkgeverId || !voornaam.trim() || !familieNaam.trim()}
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

export default function PersonenListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('action') === 'new')

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      if (searchParams.get('trigger') === 'dashboard') {
        navigate(ROUTES.DASHBOARD)
      } else if (searchParams.has('action')) {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('action')
        newParams.delete('trigger')
        setSearchParams(newParams, { replace: true })
      }
    }
  }
  
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
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <Button className="btn-primary" onClick={() => setDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t('common.toevoegen')}
          </Button>
          <DialogContent className="max-w-md bg-[var(--color-bg-page)] text-foreground border-border shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-prato-blue">
                Nieuwe Persoon
              </DialogTitle>
            </DialogHeader>
            <NieuwPersoonForm 
              onClose={() => setDialogOpen(false)}
              onSuccess={(id, werkgeverId) => {
                setDialogOpen(false)
                // Option: Navigate immediately to the new person's details
                navigate(persoonPath(werkgeverId, id))
              }}
            />
          </DialogContent>
        </Dialog>
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
