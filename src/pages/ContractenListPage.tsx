import { useMemo, useState } from 'react'
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
import { useQuery } from '@tanstack/react-query'
import { ROUTES, contractPath } from '@/config/routes'
import { FileText, ArrowRight, Plus } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import type { ContractGewijzigd, WerknemersStatuut, TypeContract } from '@/types/types'
import { useCreateContract } from '@/hooks/useContracten'
import { useAllPersonen } from '@/hooks/usePersonen'

function NieuwContractForm({ onSuccess, onClose }: { onSuccess: (id: string, persoonId: string, werkgeverId: string) => void, onClose: () => void }) {
  const { t } = useTranslation()
  const createMutation = useCreateContract()
  const { data: personen } = useAllPersonen()

  const [persoonDef, setPersoonDef] = useState('') // Combines persoonId|werkgeverId
  const [startDatum, setStartDatum] = useState(new Date().toISOString().slice(0, 10))
  const [typeContract, setTypeContract] = useState('OnbepaaldeDuur')
  const [statuut, setStatuut] = useState('Bediende')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!persoonDef) return

    const [persoonId, werkgeverId] = persoonDef.split('|') as [string, string]

    const nieuwContract: ContractGewijzigd = {
      ContractReferentieId: '',
      PersoonReferentieId: persoonId,
      WerkgeverReferentieId: werkgeverId,
      RecordDatum: new Date().toISOString(),
      ContractSnapshots: [
        {
          AanvangsDatum: startDatum,
          BeginDatum: startDatum,
          EindDatum: null,
          ParitairComite: '2000000',
          Gewest: 'Vlaanderen',
          WerknemersStatuut: statuut as WerknemersStatuut,
          Functie: 'Nieuwe medewerker',
          TypeWerknemerDimona: 'EXT',
          Tikkaartnummer: null,
          Arbeidsstelsel: 'Voltijds',
          TypeContract: typeContract as TypeContract,
          VerloningsPeriodiciteit: 'Maandelijks',
          Bezoldigingswijze: 'MaandLoon',
          VoltijdsReferentieRegime: 38,
          TypeForfait: 'Geen',
          Taalgebied: 'Nederlandstalig',
          LoonBedrag: 2500,
          LoonMunt: 'EUR',
          WerkgeversbijdrageMaaltijdcheque: null,
          MaaltijdchequesManueelToegekend: false,
          StarterJob: false,
          VrijstellingPloegenarbeid: false,
          VrijstellingNachtarbeid: false,
          VrijstellingVolContinu: false,
          VrijstellingOnroerendeStaat: false,
          VrijstellingPloegenarbeidBIS: false,
          VrijstellingVolContinuBIS: false,
          BuitenlandseLoonbelasting: false,
          NotieLaattijdigeFlexi: false,
        },
      ],
    }

    createMutation.mutate(nieuwContract, {
      onSuccess: (data) => {
        onSuccess(data.ContractReferentieId, data.PersoonReferentieId, data.WerkgeverReferentieId)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">Persoon</label>
        <Select value={persoonDef} onValueChange={setPersoonDef}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecteer persoon..." />
          </SelectTrigger>
          <SelectContent>
            {personen?.map(p => (
              <SelectItem key={p.PersoonReferentieId} value={`${p.PersoonReferentieId}|${p.WerkgeverReferentieId}`}>
                {p.PersoonSnapshots.at(-1)?.Voornaam} {p.PersoonSnapshots.at(-1)?.FamilieNaam}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">Startdatum</label>
        <Input type="date" value={startDatum} onChange={e => setStartDatum(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">Type Contract</label>
        <Select value={typeContract} onValueChange={setTypeContract}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OnbepaaldeDuur">Onbepaalde duur</SelectItem>
            <SelectItem value="BepaaldeDuur">Bepaalde duur</SelectItem>
            <SelectItem value="Vervangingscontract">Vervangingscontract</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">Statuut</label>
        <Select value={statuut} onValueChange={setStatuut}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bediende">Bediende</SelectItem>
            <SelectItem value="Arbeider">Arbeider</SelectItem>
            <SelectItem value="Kader">Kader</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t mt-2">
        <Button type="button" variant="outline" onClick={onClose} className="px-6">
          {t('common.annuleren')}
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || !persoonDef}
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

export default function ContractenListPage() {
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
    queryKey: ['contracten-global'],
    queryFn: async () => {
      const { contractenData } = await import('@/lib/mock/data/contracten');
      return contractenData as ContractGewijzigd[];
    }
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<ContractGewijzigd>[] = useMemo(
    () => [
    {
      id: 'referentie',
      header: t('contract.referentie_id'),
      accessorFn: (row) => row.ContractReferentieId,
    },
    {
      id: 'werknemer',
      header: t('persoon.titel'),
      accessorFn: (row) => row.PersoonReferentieId,
    },
    {
      id: 'statuut',
      header: t('contract.veld_statuut'),
      accessorFn: (row) => row.ContractSnapshots.at(-1)?.WerknemersStatuut ?? '',
    },
    {
      id: 'functie',
      header: t('contract.veld_functie'),
      accessorFn: (row) => row.ContractSnapshots.at(-1)?.Functie ?? '',
    },
    {
      id: 'acties',
      header: t('werkgevers.col_acties'),
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(contractPath(row.original.WerkgeverReferentieId, row.original.ContractReferentieId))}
        >
          {t('common.details')}
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
    }
  ], [t, navigate])

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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">{t('nav.contracten')}</h1>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <Button className="btn-primary" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('common.toevoegen')}
          </Button>
          <DialogContent className="max-w-md bg-[var(--color-bg-page)] text-foreground border-border shadow-xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-prato-blue">
                Nieuw Contract
              </DialogTitle>
            </DialogHeader>
            <NieuwContractForm 
              onClose={() => setDialogOpen(false)}
              onSuccess={(id, _persoonId, werkgeverId) => {
                setDialogOpen(false)
                // Option: Navigate immediately to the new contract's details
                navigate(contractPath(werkgeverId, id))
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
