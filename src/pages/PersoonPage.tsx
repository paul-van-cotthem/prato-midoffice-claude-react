import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, ChevronLeft, Plus } from 'lucide-react'
import { usePersoon, useUpdatePersoon } from '@/hooks/usePersonen'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import {
  persoonSnapshotSchema,
  type PersoonSnapshotFormValues,
} from '@/lib/validations/persoon.schema'
import { fetchBerichten, type BerichtLogEntry } from '@/lib/mock/berichten.mock'
import { lonenPath } from '@/config/routes'
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
import type { PersoonGewijzigd, PersoonSnapshot } from '@/types/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function snapshotToFormValues(snap: PersoonSnapshot): PersoonSnapshotFormValues {
  return {
    AanvangsDatum: snap.AanvangsDatum,
    INSZNummer: snap.INSZNummer,
    FamilieNaam: snap.FamilieNaam,
    Voornaam: snap.Voornaam,
    Geslacht: snap.Geslacht,
    Geboortedatum: snap.Geboortedatum,
    GeboortePlaats: snap.GeboortePlaats,
    Taal: snap.Taal,
    Straat: snap.Straat,
    Huisnummer: snap.Huisnummer,
    Bus: snap.Bus,
    Gemeente: snap.Gemeente,
    PostCode: snap.PostCode,
    Land: snap.Land,
    IBAN: snap.IBAN,
    BIC: snap.BIC,
    EmailLoonbrief: snap.EmailLoonbrief,
    BurgerlijkeStaat: snap.BurgerlijkeStaat,
    TypeBvBerekening: snap.TypeBvBerekening,
    VastBvPercentage: snap.VastBvPercentage,
    Mindervalide: snap.Mindervalide,
    PartnerInkomsten: snap.PartnerInkomsten,
    PartnerMindervalide: snap.PartnerMindervalide,
    AantalKinderenTenLaste: snap.AantalKinderenTenLaste,
    AantalMindervalideKinderenTenLaste: snap.AantalMindervalideKinderenTenLaste,
    AantalOuderePersonenTenLaste: snap.AantalOuderePersonenTenLaste,
    AantalMindervalideOuderePersonenTenLaste: snap.AantalMindervalideOuderePersonenTenLaste,
    AantalAnderePersonenTenLaste: snap.AantalAnderePersonenTenLaste,
    AantalAndereMindervalidePersonenTenLaste: snap.AantalAndereMindervalidePersonenTenLaste,
    AantalZorgbehoevendeOuderePersonenTenLaste: snap.AantalZorgbehoevendeOuderePersonenTenLaste,
    DatumInDienst: snap.DatumInDienst,
    GepensioneerdVanaf: snap.GepensioneerdVanaf,
    Werknemerskengetallen: [...snap.Werknemerskengetallen],
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

export default function PersoonPage() {
  const { werkgeverReferentieId = '', persoonReferentieId = '' } = useParams<{
    werkgeverReferentieId: string
    persoonReferentieId: string
  }>()
  const { t } = useTranslation()

  const { data: persoon, isLoading, isError, error } = usePersoon(persoonReferentieId)
  const updateMutation = useUpdatePersoon()

  const lastIndex = persoon ? persoon.PersoonSnapshots.length - 1 : 0
  const [activeSnapshotIndex, setActiveSnapshotIndex] = useState<number>(lastIndex)
  const [isNewSnapshot, setIsNewSnapshot] = useState(false)
  const [berichtEntry, setBerichtEntry] = useState<BerichtLogEntry | null>(null)
  const [showBericht, setShowBericht] = useState(false)

  const form = useForm<PersoonSnapshotFormValues>({
    resolver: zodResolver(persoonSnapshotSchema),
    defaultValues: undefined,
  })

  const blocker = useUnsavedChangesGuard(form.formState.isDirty)

  const typeBv = useWatch({ control: form.control, name: 'TypeBvBerekening' })

  // Reset form when snapshot selection or data changes
  useEffect(() => {
    if (!persoon) return
    if (isNewSnapshot) return
    const snap = persoon.PersoonSnapshots[activeSnapshotIndex]
    if (snap) form.reset(snapshotToFormValues(snap))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSnapshotIndex, persoon, isNewSnapshot])

  // Keep activeSnapshotIndex pointing to last when new data arrives for the first time
  useEffect(() => {
    if (persoon) {
      setActiveSnapshotIndex(persoon.PersoonSnapshots.length - 1)
      setIsNewSnapshot(false)
    }
    // only run when persoon transitions from undefined to defined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persoon?.PersoonReferentieId])

  function handleNieuwSnapshot() {
    if (!persoon) return
    const latestSnap = persoon.PersoonSnapshots.at(-1)
    if (!latestSnap) return
    const newValues = snapshotToFormValues(latestSnap)
    newValues.AanvangsDatum = ''
    setIsNewSnapshot(true)
    form.reset(newValues)
  }

  function handleCancelNewSnapshot() {
    setIsNewSnapshot(false)
    if (!persoon) return
    const snap = persoon.PersoonSnapshots[activeSnapshotIndex]
    if (snap) form.reset(snapshotToFormValues(snap))
  }

  function onSubmit(values: PersoonSnapshotFormValues) {
    if (!persoon) return

    const newSnapshot: PersoonSnapshot = {
      AanvangsDatum: values.AanvangsDatum,
      INSZNummer: values.INSZNummer,
      FamilieNaam: values.FamilieNaam,
      Voornaam: values.Voornaam,
      Geslacht: values.Geslacht,
      Geboortedatum: values.Geboortedatum ?? null,
      GeboortePlaats: values.GeboortePlaats ?? null,
      Taal: values.Taal,
      Straat: values.Straat,
      Huisnummer: values.Huisnummer,
      Bus: values.Bus ?? null,
      Gemeente: values.Gemeente,
      PostCode: values.PostCode,
      Land: values.Land,
      IBAN: values.IBAN ?? null,
      BIC: values.BIC ?? null,
      EmailLoonbrief: values.EmailLoonbrief ?? null,
      BurgerlijkeStaat: values.BurgerlijkeStaat ?? null,
      TypeBvBerekening: values.TypeBvBerekening ?? null,
      VastBvPercentage: values.VastBvPercentage ?? null,
      Mindervalide: values.Mindervalide ?? null,
      PartnerInkomsten: values.PartnerInkomsten ?? null,
      PartnerMindervalide: values.PartnerMindervalide ?? null,
      AantalKinderenTenLaste: values.AantalKinderenTenLaste ?? null,
      AantalMindervalideKinderenTenLaste: values.AantalMindervalideKinderenTenLaste ?? null,
      AantalOuderePersonenTenLaste: values.AantalOuderePersonenTenLaste ?? null,
      AantalMindervalideOuderePersonenTenLaste:
        values.AantalMindervalideOuderePersonenTenLaste ?? null,
      AantalAnderePersonenTenLaste: values.AantalAnderePersonenTenLaste ?? null,
      AantalAndereMindervalidePersonenTenLaste:
        values.AantalAndereMindervalidePersonenTenLaste ?? null,
      AantalZorgbehoevendeOuderePersonenTenLaste:
        values.AantalZorgbehoevendeOuderePersonenTenLaste ?? null,
      DatumInDienst: values.DatumInDienst ?? null,
      GepensioneerdVanaf: values.GepensioneerdVanaf ?? null,
      Werknemerskengetallen: values.Werknemerskengetallen as readonly string[],
    }

    let updatedSnapshots: readonly PersoonSnapshot[]
    let newActiveIndex: number

    if (isNewSnapshot) {
      updatedSnapshots = [...persoon.PersoonSnapshots, newSnapshot]
      newActiveIndex = updatedSnapshots.length - 1
    } else {
      updatedSnapshots = persoon.PersoonSnapshots.map((snap, i) =>
        i === activeSnapshotIndex ? { ...snap, ...newSnapshot } : snap,
      )
      newActiveIndex = activeSnapshotIndex
    }

    const updated: PersoonGewijzigd = {
      ...persoon,
      RecordDatum: new Date().toISOString(),
      PersoonSnapshots: updatedSnapshots,
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

  if (!persoon) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>{t('persoon.niet_gevonden')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const latestSnap = persoon.PersoonSnapshots.at(-1)
  const displayName = latestSnap
    ? `${latestSnap.FamilieNaam} ${latestSnap.Voornaam}`
    : persoonReferentieId

  const activeSnapshot = isNewSnapshot
    ? latestSnap
    : persoon.PersoonSnapshots[activeSnapshotIndex]

  if (!isNewSnapshot && !activeSnapshot) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>{t('persoon.geen_snapshot')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      {/* ─── Header ─── */}
      <div className="prato-card mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link
              to={lonenPath(werkgeverReferentieId)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('persoon.terug')}
            </Link>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {displayName}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('persoon.referentie_id')}: {persoonReferentieId}
            </p>
          </div>
        </div>

        {/* ─── Snapshot tijdlijn ─── */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {t('persoon.snapshot_tijdlijn')}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <SnapshotTimeline<PersoonSnapshot>
              snapshots={persoon.PersoonSnapshots}
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
              {t('persoon.nieuw_snapshot')}
            </Button>
          </div>
          {isNewSnapshot && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('persoon.nieuw_snapshot_info')}
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

          {/* ─── Sectie 1: Identiteit ─── */}
          <SectionCard title={t('persoon.sectie_identiteit')}>
            <FormField
              control={form.control}
              name="INSZNummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_inszNummer')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="FamilieNaam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_familieNaam')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Voornaam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_voornaam')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Geslacht"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_geslacht')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Man">{t('persoon.geslacht_man')}</SelectItem>
                      <SelectItem value="Vrouw">{t('persoon.geslacht_vrouw')}</SelectItem>
                      <SelectItem value="X">{t('persoon.geslacht_x')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Geboortedatum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_geboortedatum')}</FormLabel>
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
              name="GeboortePlaats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_geboorteplaats')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
              name="Taal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_taal')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nederlands">{t('werkgever.taal_nl')}</SelectItem>
                      <SelectItem value="Frans">{t('werkgever.taal_fr')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="AanvangsDatum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_aanvangsdatum')}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 2: Adres ─── */}
          <SectionCard title={t('persoon.sectie_adres')}>
            <FormField
              control={form.control}
              name="Straat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_straat')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Huisnummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_huisnummer')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Bus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_bus')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
              name="Gemeente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_gemeente')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PostCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_postcode')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Land"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_land')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 3: Financieel ─── */}
          <SectionCard title={t('persoon.sectie_financieel')}>
            <FormField
              control={form.control}
              name="IBAN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_iban')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
              name="BIC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_bic')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
              name="EmailLoonbrief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_email_loonbrief')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 4: Fiscaal ─── */}
          <SectionCard title={t('persoon.sectie_fiscaal')}>
            <FormField
              control={form.control}
              name="BurgerlijkeStaat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_burgerlijke_staat')}</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === '__geen__' ? null : v)}
                    value={field.value ?? '__geen__'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="— Niet opgegeven —" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__geen__">{t('common.niet_opgegeven')}</SelectItem>
                      <SelectItem value="Ongehuwd">{t('persoon.bs_ongehuwd')}</SelectItem>
                      <SelectItem value="Gehuwd">{t('persoon.bs_gehuwd')}</SelectItem>
                      <SelectItem value="Weduwe">{t('persoon.bs_weduwe')}</SelectItem>
                      <SelectItem value="WettelijkGescheiden">{t('persoon.bs_wettelijk_gescheiden')}</SelectItem>
                      <SelectItem value="FeitelijkGescheiden">{t('persoon.bs_feitelijk_gescheiden')}</SelectItem>
                      <SelectItem value="Samenwonend">{t('persoon.bs_samenwonend')}</SelectItem>
                      <SelectItem value="FeitelijkSamenwonend">{t('persoon.bs_feitelijk_samenwonend')}</SelectItem>
                      <SelectItem value="ScheidingVanTafelEnBed">
                        {t('persoon.bs_scheiding_tafel_bed')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TypeBvBerekening"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_type_bv')}</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === '__geen__' ? null : v)}
                    value={field.value ?? '__geen__'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="— Niet opgegeven —" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__geen__">{t('common.niet_opgegeven')}</SelectItem>
                      <SelectItem value="VastPercentage">{t('persoon.bv_vast_percentage')}</SelectItem>
                      <SelectItem value="Schalen">{t('persoon.bv_schalen')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {typeBv === 'VastPercentage' && (
              <FormField
                control={form.control}
                name="VastBvPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('persoon.veld_vast_bv_percentage')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
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
            )}
            <FormField
              control={form.control}
              name="Mindervalide"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ touchAction: 'manipulation' }}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('persoon.veld_mindervalide')}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PartnerInkomsten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_partner_inkomsten')}</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === '__geen__' ? null : v)}
                    value={field.value ?? '__geen__'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="— Niet opgegeven —" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__geen__">{t('common.niet_opgegeven')}</SelectItem>
                      <SelectItem value="EigenInkomsten">{t('persoon.pi_eigen_inkomsten')}</SelectItem>
                      <SelectItem value="EigenInkomstenOnderGrens3">
                        {t('persoon.pi_eigen_inkomsten_grens3')}
                      </SelectItem>
                      <SelectItem value="EigenInkomstenOnderGrens2">
                        {t('persoon.pi_eigen_inkomsten_grens2')}
                      </SelectItem>
                      <SelectItem value="EigenInkomstenOnderGrens1">
                        {t('persoon.pi_eigen_inkomsten_grens1')}
                      </SelectItem>
                      <SelectItem value="GeenEigenInkomsten">{t('persoon.pi_geen_eigen_inkomsten')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PartnerMindervalide"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ touchAction: 'manipulation' }}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('persoon.veld_partner_mindervalide')}</FormLabel>
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 5: Ten laste ─── */}
          <SectionCard title={t('persoon.sectie_tenlasten')}>
            <FormField
              control={form.control}
              name="AantalKinderenTenLaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_kinderen_ten_laste')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
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
              name="AantalMindervalideKinderenTenLaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_mindervalide_kinderen')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
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
              name="AantalOuderePersonenTenLaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_oudere_personen')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
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
              name="AantalMindervalideOuderePersonenTenLaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_mindervalide_ouderen')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
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
              name="AantalAnderePersonenTenLaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_andere_personen')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
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
              name="AantalAndereMindervalidePersonenTenLaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_andere_mindervalide_personen')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
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
              name="AantalZorgbehoevendeOuderePersonenTenLaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_zorgbehoevende_ouderen')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
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
          </SectionCard>

          {/* ─── Sectie 6: Tewerkstelling ─── */}
          <SectionCard title={t('persoon.sectie_dienstverband')}>
            <FormField
              control={form.control}
              name="DatumInDienst"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_datum_in_dienst')}</FormLabel>
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
              name="GepensioneerdVanaf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('persoon.veld_gepensioneerd_vanaf')}</FormLabel>
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
              name="Werknemerskengetallen"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t('persoon.veld_werknemerskengetallen')}</FormLabel>
                  <FormControl>
                    <Input
                      value={(field.value ?? []).join(', ')}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="Werknemerskengetal 1, kengetal 2, ..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

        </form>
      </Form>

      {/* ─── Unsaved changes blocker dialog ─── */}
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

      {/* ─── Bericht preview sheet ─── */}
      <BerichtPreview
        entry={berichtEntry}
        open={showBericht}
        onClose={() => setShowBericht(false)}
      />
    </>
  )
}
