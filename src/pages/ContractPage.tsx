import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, ChevronLeft, Plus } from 'lucide-react'
import { useContract, useUpdateContract } from '@/hooks/useContracten'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import {
  contractSnapshotSchema,
  type ContractSnapshotFormValues,
} from '@/lib/validations/contract.schema'
import { fetchBerichten, type BerichtLogEntry } from '@/lib/mock/berichten.mock'
import { persoonPath } from '@/config/routes'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { DeleteButton } from '@/components/common/DeleteButton'
import { SnapshotTimeline } from '@/components/common/SnapshotTimeline'
import { BerichtPreview } from '@/components/common/BerichtPreview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import type { ContractGewijzigd, ContractSnapshot } from '@/types/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function snapshotToFormValues(snap: ContractSnapshot): ContractSnapshotFormValues {
  return {
    AanvangsDatum: snap.AanvangsDatum,
    BeginDatum: snap.BeginDatum,
    EindDatum: snap.EindDatum,
    ParitairComite: snap.ParitairComite,
    Gewest: snap.Gewest,
    WerknemersStatuut: snap.WerknemersStatuut,
    Functie: snap.Functie,
    TypeWerknemerDimona: snap.TypeWerknemerDimona,
    Tikkaartnummer: snap.Tikkaartnummer,
    Arbeidsstelsel: snap.Arbeidsstelsel,
    TypeContract: snap.TypeContract,
    VerloningsPeriodiciteit: snap.VerloningsPeriodiciteit,
    Bezoldigingswijze: snap.Bezoldigingswijze,
    VoltijdsReferentieRegime: snap.VoltijdsReferentieRegime,
    TypeForfait: snap.TypeForfait,
    Taalgebied: snap.Taalgebied,
    LoonBedrag: snap.LoonBedrag,
    LoonMunt: snap.LoonMunt,
    WerkgeversbijdrageMaaltijdcheque: snap.WerkgeversbijdrageMaaltijdcheque,
    MaaltijdchequesManueelToegekend: snap.MaaltijdchequesManueelToegekend,
    StarterJob: snap.StarterJob,
    VrijstellingPloegenarbeid: snap.VrijstellingPloegenarbeid,
    VrijstellingNachtarbeid: snap.VrijstellingNachtarbeid,
    VrijstellingVolContinu: snap.VrijstellingVolContinu,
    VrijstellingOnroerendeStaat: snap.VrijstellingOnroerendeStaat,
    VrijstellingPloegenarbeidBIS: snap.VrijstellingPloegenarbeidBIS,
    VrijstellingVolContinuBIS: snap.VrijstellingVolContinuBIS,
    BuitenlandseLoonbelasting: snap.BuitenlandseLoonbelasting,
    NotieLaattijdigeFlexi: snap.NotieLaattijdigeFlexi,
  }
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="prato-card mb-6">
      <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractPage() {
  const { werkgeverReferentieId = '', contractReferentieId = '' } = useParams<{
    werkgeverReferentieId: string
    contractReferentieId: string
  }>()
  const { t } = useTranslation()

  const { data: contract, isLoading, isError, error } = useContract(contractReferentieId)
  const updateMutation = useUpdateContract()

  const lastIndex = contract ? contract.ContractSnapshots.length - 1 : 0
  const [activeSnapshotIndex, setActiveSnapshotIndex] = useState<number>(lastIndex)
  const [isNewSnapshot, setIsNewSnapshot] = useState(false)
  const [berichtEntry, setBerichtEntry] = useState<BerichtLogEntry | null>(null)
  const [showBericht, setShowBericht] = useState(false)

  const form = useForm<ContractSnapshotFormValues>({
    resolver: zodResolver(contractSnapshotSchema),
    defaultValues: undefined,
  })

  const blocker = useUnsavedChangesGuard(form.formState.isDirty)

  // Reset form when snapshot selection or data changes
  useEffect(() => {
    if (!contract) return
    if (isNewSnapshot) return
    const snap = contract.ContractSnapshots[activeSnapshotIndex]
    if (snap) form.reset(snapshotToFormValues(snap))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSnapshotIndex, contract, isNewSnapshot])

  // Keep activeSnapshotIndex pointing to last when new data arrives for the first time
  useEffect(() => {
    if (contract) {
      setActiveSnapshotIndex(contract.ContractSnapshots.length - 1)
      setIsNewSnapshot(false)
    }
    // only run when contract transitions from undefined to defined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract?.ContractReferentieId])

  function handleNieuwSnapshot() {
    if (!contract) return
    const latestSnap = contract.ContractSnapshots.at(-1)
    if (!latestSnap) return
    const newValues = snapshotToFormValues(latestSnap)
    newValues.AanvangsDatum = ''
    setIsNewSnapshot(true)
    form.reset(newValues)
  }

  function handleCancelNewSnapshot() {
    setIsNewSnapshot(false)
    if (!contract) return
    const snap = contract.ContractSnapshots[activeSnapshotIndex]
    if (snap) form.reset(snapshotToFormValues(snap))
  }

  function onSubmit(values: ContractSnapshotFormValues) {
    if (!contract) return

    const newSnapshot: ContractSnapshot = {
      AanvangsDatum: values.AanvangsDatum,
      BeginDatum: values.BeginDatum,
      EindDatum: values.EindDatum ?? null,
      ParitairComite: values.ParitairComite,
      Gewest: values.Gewest,
      WerknemersStatuut: values.WerknemersStatuut,
      Functie: values.Functie ?? null,
      TypeWerknemerDimona: values.TypeWerknemerDimona ?? null,
      Tikkaartnummer: values.Tikkaartnummer ?? null,
      Arbeidsstelsel: values.Arbeidsstelsel,
      TypeContract: values.TypeContract,
      VerloningsPeriodiciteit: values.VerloningsPeriodiciteit,
      Bezoldigingswijze: values.Bezoldigingswijze,
      VoltijdsReferentieRegime: values.VoltijdsReferentieRegime ?? null,
      TypeForfait: values.TypeForfait,
      Taalgebied: values.Taalgebied,
      LoonBedrag: values.LoonBedrag ?? null,
      LoonMunt: values.LoonMunt,
      WerkgeversbijdrageMaaltijdcheque: values.WerkgeversbijdrageMaaltijdcheque ?? null,
      MaaltijdchequesManueelToegekend: values.MaaltijdchequesManueelToegekend,
      StarterJob: values.StarterJob,
      VrijstellingPloegenarbeid: values.VrijstellingPloegenarbeid,
      VrijstellingNachtarbeid: values.VrijstellingNachtarbeid,
      VrijstellingVolContinu: values.VrijstellingVolContinu,
      VrijstellingOnroerendeStaat: values.VrijstellingOnroerendeStaat,
      VrijstellingPloegenarbeidBIS: values.VrijstellingPloegenarbeidBIS,
      VrijstellingVolContinuBIS: values.VrijstellingVolContinuBIS,
      BuitenlandseLoonbelasting: values.BuitenlandseLoonbelasting,
      NotieLaattijdigeFlexi: values.NotieLaattijdigeFlexi,
    }

    let updatedSnapshots: readonly ContractSnapshot[]
    let newActiveIndex: number

    if (isNewSnapshot) {
      updatedSnapshots = [...contract.ContractSnapshots, newSnapshot]
      newActiveIndex = updatedSnapshots.length - 1
    } else {
      updatedSnapshots = contract.ContractSnapshots.map((snap, i) =>
        i === activeSnapshotIndex ? { ...snap, ...newSnapshot } : snap,
      )
      newActiveIndex = activeSnapshotIndex
    }

    const updated: ContractGewijzigd = {
      ...contract,
      RecordDatum: new Date().toISOString(),
      ContractSnapshots: updatedSnapshots,
    }

    updateMutation.mutate(updated, {
      onSuccess: () => {
        setIsNewSnapshot(false)
        setActiveSnapshotIndex(newActiveIndex)
        const berichten = fetchBerichten()
        const laatste = berichten[0]
        if (laatste) {
          setBerichtEntry(laatste)
          setShowBericht(true)
        }
      },
    })
  }

  // ─── Loading / error states ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

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

  if (!contract) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>{t('contract.niet_gevonden')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const activeSnapshot = isNewSnapshot
    ? contract.ContractSnapshots.at(-1)
    : contract.ContractSnapshots[activeSnapshotIndex]

  if (!isNewSnapshot && !activeSnapshot) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>{t('contract.geen_snapshot')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      {/* ─── Unsaved changes dialog ─── */}
      <AlertDialog open={blocker.state === 'blocked'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.onopgeslagen_wijzigingen_titel')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.onopgeslagen_wijzigingen_tekst')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => blocker.reset?.()}>{t('common.annuleren')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => blocker.proceed?.()}>{t('common.verdergaan')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Bericht preview ─── */}
      {berichtEntry !== null && (
        <BerichtPreview
          entry={berichtEntry}
          open={showBericht}
          onClose={() => setShowBericht(false)}
        />
      )}

      {/* ─── Header ─── */}
      <div className="prato-card mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link
              to={persoonPath(werkgeverReferentieId, contract.PersoonReferentieId)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('contract.terug')}
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {t('contract.titel')}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('contract.referentie_id')}: {contractReferentieId}
            </p>
            <p className="text-sm text-muted-foreground">
              Persoon: {contract.PersoonReferentieId}
            </p>
          </div>
        </div>

        {/* ─── Snapshot tijdlijn ─── */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {t('contract.snapshot_tijdlijn')}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <SnapshotTimeline<ContractSnapshot>
              snapshots={contract.ContractSnapshots}
              activeIndex={isNewSnapshot ? -1 : activeSnapshotIndex}
              onSelect={(i) => {
                setIsNewSnapshot(false)
                setActiveSnapshotIndex(i)
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNieuwSnapshot}
              disabled={isNewSnapshot}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              {t('contract.nieuw_snapshot')}
            </Button>
          </div>
          {isNewSnapshot && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('contract.nieuw_snapshot_info')}
            </p>
          )}
        </div>
      </div>

      {/* ─── Form ─── */}
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} noValidate>

          {/* Action buttons */}
          <div className="prato-card mb-6 flex items-center gap-3 flex-wrap">
            <Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty}>
              {updateMutation.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {t('common.opslaan')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (isNewSnapshot) {
                  handleCancelNewSnapshot()
                } else {
                  form.reset()
                }
              }}
              disabled={!form.formState.isDirty && !isNewSnapshot}
            >
              {t('common.annuleren')}
            </Button>
            <DeleteButton />
          </div>

          {/* ─── Sectie 1: Periode ─── */}
          <SectionCard title={t('contract.sectie_periode')}>
            <FormField
              control={form.control}
              name="BeginDatum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_begindatum')}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="EindDatum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_einddatum')}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="AanvangsDatum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_aanvangsdatum')}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 2: Identificatie ─── */}
          <SectionCard title={t('contract.sectie_functie_loon')}>
            <FormField
              control={form.control}
              name="ParitairComite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_type_contract')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Gewest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_statuut')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Vlaanderen">Vlaanderen</SelectItem>
                      <SelectItem value="Wallonie">Wallonië</SelectItem>
                      <SelectItem value="Brussel">Brussel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="WerknemersStatuut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_statuut')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Arbeider">Arbeider</SelectItem>
                      <SelectItem value="Bediende">Bediende</SelectItem>
                      <SelectItem value="Kader">Kader</SelectItem>
                      <SelectItem value="Directeur">Directeur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Functie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_functie')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TypeWerknemerDimona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_barema')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Tikkaartnummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_bruto_maandloon')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 3: Arbeidsregeling ─── */}
          <SectionCard title={t('contract.sectie_arbeidstijd')}>
            <FormField
              control={form.control}
              name="Arbeidsstelsel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_regime')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Voltijds">Voltijds</SelectItem>
                      <SelectItem value="Deeltijds">Deeltijds</SelectItem>
                      <SelectItem value="Flexi">Flexi-job</SelectItem>
                      <SelectItem value="Jobstudent">Jobstudent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TypeContract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_type_contract')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OnbepaaldeDuur">Onbepaalde duur</SelectItem>
                      <SelectItem value="BepaaldeDuur">Bepaalde duur</SelectItem>
                      <SelectItem value="Vervangingscontract">Vervangingscontract</SelectItem>
                      <SelectItem value="Uitvoering">Uitvoering</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="VerloningsPeriodiciteit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_uren_per_week')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Maandelijks">Maandelijks</SelectItem>
                      <SelectItem value="Tweewekelijks">Tweewekelijks</SelectItem>
                      <SelectItem value="Wekelijks">Wekelijks</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Bezoldigingswijze"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_voltijds_equivalent')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UurLoon">Uurloon</SelectItem>
                      <SelectItem value="MaandLoon">Maandloon</SelectItem>
                      <SelectItem value="DagLoon">Dagloon</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="VoltijdsReferentieRegime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_dagregime')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TypeForfait"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_ploegentoeslag')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Geen">Geen</SelectItem>
                      <SelectItem value="Klein">Klein</SelectItem>
                      <SelectItem value="Groot">Groot</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Taalgebied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_nachttoelage')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nederlandstalig">Nederlandstalig</SelectItem>
                      <SelectItem value="Franstalig">Franstalig</SelectItem>
                      <SelectItem value="Duitstalig">Duitstalig</SelectItem>
                      <SelectItem value="Tweetalig">Tweetalig</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 4: Verloning ─── */}
          <SectionCard title={t('contract.sectie_premies')}>
            <FormField
              control={form.control}
              name="LoonBedrag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_bruto_maandloon')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LoonMunt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_uurloon')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="WerkgeversbijdrageMaaltijdcheque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract.veld_werkgeversbijdrage_mc')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="MaaltijdchequesManueelToegekend"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 pt-6">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('contract.veld_maaltijdcheques_manueel')}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="StarterJob"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 pt-6">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('contract.veld_starterjob')}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 5: BV-vrijstellingen ─── */}
          <div className="prato-card mb-6">
            <h2
              className="text-base font-semibold mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              {t('contract.sectie_overige')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="VrijstellingPloegenarbeid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">{t('werkgever.veld_vrijstelling_ploegenarbeid')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="VrijstellingNachtarbeid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">{t('werkgever.veld_vrijstelling_nachtarbeid')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="VrijstellingVolContinu"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">{t('werkgever.veld_vrijstelling_vol_continu')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="VrijstellingOnroerendeStaat"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">{t('werkgever.veld_vrijstelling_onroerende_staat')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="VrijstellingPloegenarbeidBIS"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">{t('contract.veld_vrijstelling_ploegenarbeid_bis')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="VrijstellingVolContinuBIS"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">{t('contract.veld_vrijstelling_vol_continu_bis')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ─── Sectie 6: Overige ─── */}
          <SectionCard title={t('contract.sectie_overige')}>
            <FormField
              control={form.control}
              name="BuitenlandseLoonbelasting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 pt-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('contract.veld_buitenlandse_loonbelasting')}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NotieLaattijdigeFlexi"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 pt-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('contract.veld_notie_laattijdige_flexi')}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

        </form>
      </Form>
    </>
  )
}
