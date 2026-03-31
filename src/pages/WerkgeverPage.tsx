import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Building2, ChevronLeft } from 'lucide-react'
import { useWerkgever, useUpdateWerkgever } from '@/hooks/useWerkgevers'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import {
  werkgeverSnapshotSchema,
  type WerkgeverSnapshotFormValues,
} from '@/lib/validations/werkgever.schema'
import { fetchBerichten, type BerichtLogEntry } from '@/lib/mock/berichten.mock'
import { lonenPath, ROUTES } from '@/config/routes'
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
import type { WerkgeverGewijzigd, WerkgeverSnapshot } from '@/types/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function snapshotToFormValues(snap: WerkgeverSnapshot): WerkgeverSnapshotFormValues {
  return {
    AanvangsDatum: snap.AanvangsDatum,
    OndernemingsNummer: snap.OndernemingsNummer,
    RSZNummer: snap.RSZNummer,
    BTWNummer: snap.BTWNummer,
    RechtspersonenRegister: snap.RechtspersonenRegister,
    MaatschappelijkeNaam: snap.MaatschappelijkeNaam,
    Vennootschapsvorm: snap.Vennootschapsvorm,
    Taal: snap.Taal,
    Periodiciteit: snap.Periodiciteit,
    Adres: { ...snap.Adres },
    Email: snap.Email,
    Telefoon: snap.Telefoon,
    Website: snap.Website,
    IBAN: snap.IBAN,
    BIC: snap.BIC,
    IBANLonen: snap.IBANLonen,
    BICLonen: snap.BICLonen,
    ParitaireComites: snap.ParitaireComites.map((pc) => ({ ...pc })),
    BetaaltBvZelf: snap.BetaaltBvZelf,
    VrijstellingPloegenarbeid: snap.VrijstellingPloegenarbeid,
    VrijstellingNachtarbeid: snap.VrijstellingNachtarbeid,
    VrijstellingVolContinu: snap.VrijstellingVolContinu,
    VrijstellingOnroerendeStaat: snap.VrijstellingOnroerendeStaat,
    ChequeLeverancier: snap.ChequeLeverancier,
    WerkgeversbijdrageMaaltijdcheque: snap.WerkgeversbijdrageMaaltijdcheque,
    NotieCuratele: snap.NotieCuratele,
    Erkenningsnummer: snap.Erkenningsnummer,
    BegindatumVakantieperiode: snap.BegindatumVakantieperiode,
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

export default function WerkgeverPage() {
  const { werkgeverReferentieId = '' } = useParams<{ werkgeverReferentieId: string }>()
  const { t } = useTranslation()

  const { data: werkgever, isLoading, isError, error } = useWerkgever(werkgeverReferentieId)

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

  if (!werkgever) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>{t('werkgever.niet_gevonden')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <WerkgeverForm key={werkgever.WerkgeverReferentieId} werkgever={werkgever} />
}

// ─── Inner form component ──────────────────────────────────────────────────────

function WerkgeverForm({ werkgever }: { werkgever: WerkgeverGewijzigd }) {
  const { werkgeverReferentieId = '' } = useParams<{ werkgeverReferentieId: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const updateMutation = useUpdateWerkgever()

  const lastIndex = werkgever.WerkgeverSnapshots.length - 1
  const [activeSnapshotIndex, setActiveSnapshotIndex] = useState<number>(lastIndex)
  const [berichtEntry, setBerichtEntry] = useState<BerichtLogEntry | null>(null)
  const [showBericht, setShowBericht] = useState(false)

  const initialSnapshot = werkgever.WerkgeverSnapshots[lastIndex]

  const form = useForm<WerkgeverSnapshotFormValues>({
    resolver: zodResolver(werkgeverSnapshotSchema),
    defaultValues: initialSnapshot ? snapshotToFormValues(initialSnapshot) : undefined,
  })

  const blocker = useUnsavedChangesGuard(form.formState.isDirty)

  // Reset form when snapshot selection changes
  useEffect(() => {
    const snap = werkgever.WerkgeverSnapshots[activeSnapshotIndex]
    if (snap) form.reset(snapshotToFormValues(snap))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSnapshotIndex, werkgever])

  function onSubmit(values: WerkgeverSnapshotFormValues) {
    const updatedSnapshots = werkgever.WerkgeverSnapshots.map((snap, i) =>
      i === activeSnapshotIndex ? ({ ...snap, ...values } as WerkgeverSnapshot) : snap,
    )
    const updated: WerkgeverGewijzigd = {
      ...werkgever,
      RecordDatum: new Date().toISOString(),
      WerkgeverSnapshots: updatedSnapshots,
    }
    updateMutation.mutate(updated, {
      onSuccess: () => {
        const berichten = fetchBerichten()
        const laatste = berichten[0]
        if (laatste) {
          setBerichtEntry(laatste)
          setShowBericht(true)
        }
      },
    })
  }

  const activeSnapshot = werkgever.WerkgeverSnapshots[activeSnapshotIndex]
  const displayName =
    werkgever.WerkgeverSnapshots.at(-1)?.MaatschappelijkeNaam ?? werkgeverReferentieId

  if (!activeSnapshot) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>{t('werkgever.geen_snapshot')}</AlertDescription>
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
              to={ROUTES.WERKGEVERS}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('werkgever.terug')}
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {displayName}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('werkgever.referentie_id')}: {werkgeverReferentieId}
            </p>
          </div>
        </div>

        {/* ─── Snapshot tijdlijn ─── */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {t('werkgever.snapshot_tijdlijn')}
          </p>
          <SnapshotTimeline<WerkgeverSnapshot>
            snapshots={werkgever.WerkgeverSnapshots}
            activeIndex={activeSnapshotIndex}
            onSelect={setActiveSnapshotIndex}
          />
        </div>
      </div>

      {/* ─── Form ─── */}
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} noValidate>
          {/* Main Actions - Inside a card for visibility */}
          <div className="prato-card mb-6 flex items-center gap-3 flex-wrap">
            <Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty}>
              {updateMutation.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {t('common.opslaan')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={!form.formState.isDirty}
            >
              {t('common.annuleren')}
            </Button>
            <DeleteButton />
            <div className="ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => void navigate(lonenPath(werkgeverReferentieId))}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                {t('werkgever.naar_lonen')}
              </Button>
            </div>
          </div>

          {/* ─── Sectie 1: Identificatie ─── */}
          <SectionCard title={t('werkgever.sectie_identificatie')}>
            <FormField
              control={form.control}
              name="OndernemingsNummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_ondernemingsnummer')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="RSZNummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_rszNummer')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="BTWNummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_btwnummer')}</FormLabel>
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
              name="RechtspersonenRegister"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_rechtspersonenregister')}</FormLabel>
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
          </SectionCard>

          {/* ─── Sectie 2: Naam & Structuur ─── */}
          <SectionCard title={t('werkgever.sectie_naam_structuur')}>
            <FormField
              control={form.control}
              name="MaatschappelijkeNaam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_maatschappelijkeNaam')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Vennootschapsvorm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_vennootschapsvorm')}</FormLabel>
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
                  <FormLabel>{t('werkgever.veld_taal')}</FormLabel>
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
              name="Periodiciteit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_periodiciteit')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Maandelijks">{t('werkgever.periodiciteit_maandelijks')}</SelectItem>
                      <SelectItem value="Tweewekelijks">{t('werkgever.periodiciteit_tweewekelijks')}</SelectItem>
                      <SelectItem value="Wekelijks">{t('werkgever.periodiciteit_wekelijks')}</SelectItem>
                      <SelectItem value="Dagelijks">{t('werkgever.periodiciteit_dagelijks')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 3: Contactgegevens ─── */}
          <SectionCard title={t('werkgever.sectie_contactgegevens')}>
            <FormField
              control={form.control}
              name="Adres.Straat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_straat')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Adres.Huisnummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_huisnummer')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Adres.Bus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_bus')}</FormLabel>
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
              name="Adres.Gemeente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_gemeente')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Adres.PostCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_postcode')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Adres.Land"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_land')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_email')}</FormLabel>
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
            <FormField
              control={form.control}
              name="Telefoon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_telefoon')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
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
              name="Website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_website')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 4: Bankgegevens ─── */}
          <SectionCard title={t('werkgever.sectie_bankgegevens')}>
            <FormField
              control={form.control}
              name="IBAN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_iban')}</FormLabel>
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
                  <FormLabel>{t('werkgever.veld_bic')}</FormLabel>
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
              name="IBANLonen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_iban_lonen')}</FormLabel>
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
              name="BICLonen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_bic_lonen')}</FormLabel>
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
          </SectionCard>

          {/* ─── Sectie 5: Sociale zekerheid ─── */}
          <SectionCard title={t('werkgever.sectie_sociale_zekerheid')}>
            {/* Paritaire comités — read-only display */}
            <div className="md:col-span-2">
              <p className="text-sm font-medium mb-1">{t('werkgever.veld_paritaire_comites')}</p>
              {activeSnapshot.ParitaireComites.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('werkgever.geen_paritaire_comites')}</p>
              ) : (
                <ul className="space-y-1">
                  {activeSnapshot.ParitaireComites.map((pc) => (
                    <li key={pc.Code} className="text-sm">
                      <span className="font-medium">{pc.Code}</span> — {pc.Omschrijving}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <FormField
              control={form.control}
              name="BetaaltBvZelf"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ touchAction: 'manipulation' }}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('werkgever.veld_betaalt_bv_zelf')}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="VrijstellingPloegenarbeid"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ touchAction: 'manipulation' }}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('werkgever.veld_vrijstelling_ploegenarbeid')}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="VrijstellingNachtarbeid"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ touchAction: 'manipulation' }}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('werkgever.veld_vrijstelling_nachtarbeid')}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="VrijstellingVolContinu"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ touchAction: 'manipulation' }}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('werkgever.veld_vrijstelling_vol_continu')}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="VrijstellingOnroerendeStaat"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ touchAction: 'manipulation' }}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('werkgever.veld_vrijstelling_onroerende_staat')}</FormLabel>
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 6: Maaltijdcheques ─── */}
          <SectionCard title={t('werkgever.sectie_maaltijdcheques')}>
            <FormField
              control={form.control}
              name="ChequeLeverancier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_cheque_leverancier')}</FormLabel>
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
              name="WerkgeversbijdrageMaaltijdcheque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_werkgeversbijdrage_mc')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        field.onChange(val === '' ? null : parseFloat(val))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          {/* ─── Sectie 7: Overige ─── */}
          <SectionCard title={t('werkgever.sectie_overige')}>
            <FormField
              control={form.control}
              name="NotieCuratele"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ touchAction: 'manipulation' }}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">{t('werkgever.veld_notie_curatele')}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Erkenningsnummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_erkenningsnummer')}</FormLabel>
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
              name="BegindatumVakantieperiode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('werkgever.veld_aanvangsdatum_vakantie')}</FormLabel>
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
                  <FormLabel>{t('werkgever.sectie_overige')} — {t('persoon.veld_aanvangsdatum')}</FormLabel>
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
            <AlertDialogCancel onClick={() => blocker.reset?.()}>
              {t('common.annuleren')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => blocker.proceed?.()}>
              {t('common.verdergaan')}
            </AlertDialogAction>
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
