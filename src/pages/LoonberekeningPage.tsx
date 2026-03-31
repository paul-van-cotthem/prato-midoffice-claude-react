import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calculator, ChevronLeft, Plus, Trash2, Eye } from 'lucide-react'
import { useLoonberekening, useUpdateLoonberekening } from '@/hooks/useLoonberekening'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import {
  loonberekeningSchema,
  type LoonberekeningFormValues,
} from '@/lib/validations/loonberekening.schema'
import { fetchBerichten, type BerichtLogEntry } from '@/lib/mock/berichten.mock'
import { lonenPath } from '@/config/routes'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { DeleteButton } from '@/components/common/DeleteButton'
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
import type {
  LoonberekeningBepaald,
  BerekeningsRegel,
  BerekeningsStap,
  AfwezigheidsType,
  BerekeningType,
  LoonStatus,
} from '@/types/types'

// ─── Sentinel ────────────────────────────────────────────────────────────────

const GEEN_SENTINEL = '__geen__'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lbToFormValues(lb: LoonberekeningBepaald): LoonberekeningFormValues {
  return {
    FiscaalJaar: lb.FiscaalJaar,
    Loonperiode: lb.Loonperiode,
    Berekeningsdatum: lb.Berekeningsdatum,
    BerekeningType: lb.BerekeningType,
    Status: lb.Status,
    Arbeidstijdgegevens: lb.Arbeidstijdgegevens.map((atg) => ({
      Datum: atg.Datum,
      UrenGewerkt: atg.UrenGewerkt,
      AfwezigheidsType: atg.AfwezigheidsType,
    })),
    BrutoLoonBerekening: stapToForm(lb.BrutoLoonBerekening),
    RSZBerekening: stapToForm(lb.RSZBerekening),
    BelastbaarInkomenBerekening: stapToForm(lb.BelastbaarInkomenBerekening),
    BVBerekening: stapToForm(lb.BVBerekening),
    BBSZBerekening: stapToForm(lb.BBSZBerekening),
    NettoLoonBerekening: stapToForm(lb.NettoLoonBerekening),
    LoonbeslagBerekeningen: lb.LoonbeslagBerekeningen.map((l) => ({
      Omschrijving: l.Omschrijving,
      Bedrag: l.Bedrag,
    })),
    WerkuitkeringBerekening: lb.WerkuitkeringBerekening
      ? {
          Instelling: lb.WerkuitkeringBerekening.Instelling,
          Bedrag: lb.WerkuitkeringBerekening.Bedrag,
          Periode: lb.WerkuitkeringBerekening.Periode,
        }
      : null,
    VoorschotBedrag: lb.VoorschotBedrag,
    VoorschotBetaald: lb.VoorschotBetaald,
    Opmerkingen: lb.Opmerkingen,
    BerichtUrl: lb.BerichtUrl,
  }
}

function stapToForm(stap: BerekeningsStap): LoonberekeningFormValues['BrutoLoonBerekening'] {
  return {
    Naam: stap.Naam,
    Regels: stap.Regels.map((r) => ({
      Omschrijving: r.Omschrijving,
      Bedrag: r.Bedrag,
      IsTotaal: r.IsTotaal,
    })),
    Totaal: stap.Totaal,
  }
}

function formStapToStap(
  stap: LoonberekeningFormValues['BrutoLoonBerekening'],
): BerekeningsStap {
  return {
    Naam: stap.Naam,
    Regels: stap.Regels.map(
      (r): BerekeningsRegel => ({
        Omschrijving: r.Omschrijving,
        Bedrag: r.Bedrag,
        IsTotaal: r.IsTotaal,
      }),
    ),
    Totaal: stap.Totaal,
  }
}

// ─── BerekeningsStapSection ───────────────────────────────────────────────────

type StapFieldName =
  | 'BrutoLoonBerekening'
  | 'RSZBerekening'
  | 'BelastbaarInkomenBerekening'
  | 'BVBerekening'
  | 'BBSZBerekening'
  | 'NettoLoonBerekening'

interface BerekeningsStapSectionProps {
  title: string
  fieldName: StapFieldName
  form: ReturnType<typeof useForm<LoonberekeningFormValues>>
}

function BerekeningsStapSection({ title, fieldName, form }: BerekeningsStapSectionProps) {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${fieldName}.Regels` as `BrutoLoonBerekening.Regels`,
  })

  return (
    <div className="prato-card mb-6">
      <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          control={form.control}
          name={`${fieldName}.Naam` as `BrutoLoonBerekening.Naam`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('loonberekening.veld_naam')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${fieldName}.Totaal` as `BrutoLoonBerekening.Totaal`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('loonberekening.veld_totaal')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  className="font-semibold text-base"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {fields.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 pr-3 font-medium text-muted-foreground">
                  {t('loonberekening.veld_omschrijving')}
                </th>
                <th className="text-right pb-2 pr-3 font-medium text-muted-foreground w-32">
                  {t('loonberekening.veld_bedrag')}
                </th>
                <th className="text-center pb-2 pr-3 font-medium text-muted-foreground w-20">
                  {t('loonberekening.veld_istotaal')}
                </th>
                <th className="pb-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b border-border/50 last:border-0">
                  <td className="py-1.5 pr-3">
                    <FormField
                      control={form.control}
                      name={
                        `${fieldName}.Regels.${index}.Omschrijving` as `BrutoLoonBerekening.Regels.${number}.Omschrijving`
                      }
                      render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...f} className="h-8 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <FormField
                      control={form.control}
                      name={
                        `${fieldName}.Regels.${index}.Bedrag` as `BrutoLoonBerekening.Regels.${number}.Bedrag`
                      }
                      render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              className="h-8 text-sm text-right"
                              value={f.value}
                              onChange={(e) => f.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="py-1.5 pr-3 text-center">
                    <FormField
                      control={form.control}
                      name={
                        `${fieldName}.Regels.${index}.IsTotaal` as `BrutoLoonBerekening.Regels.${number}.IsTotaal`
                      }
                      render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={f.value}
                              onChange={(e) => f.onChange(e.target.checked)}
                              className="h-4 w-4"
                              aria-label="Is totaalregel"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="py-1.5">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Regel verwijderen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-3">{t('loonberekening.geen_regels')}</p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 flex items-center gap-1"
        onClick={() => append({ Omschrijving: '', Bedrag: 0, IsTotaal: false })}
      >
        <Plus className="h-4 w-4" />
        {t('loonberekening.regel_toevoegen')}
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoonberekeningPage() {
  const { werkgeverReferentieId = '', loonberekeningReferentieId = '' } = useParams<{
    werkgeverReferentieId: string
    loonberekeningReferentieId: string
  }>()
  const { t } = useTranslation()

  const { data: lb, isLoading, isError, error } = useLoonberekening(loonberekeningReferentieId)

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

  if (!lb) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>{t('loonberekening.niet_gevonden')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <LoonberekeningForm
      key={lb.LoonberekeningReferentieId}
      lb={lb}
      werkgeverReferentieId={werkgeverReferentieId}
    />
  )
}

// ─── Inner form component ──────────────────────────────────────────────────────

function LoonberekeningForm({
  lb,
  werkgeverReferentieId,
}: {
  lb: LoonberekeningBepaald
  werkgeverReferentieId: string
}) {
  const { t } = useTranslation()
  const updateMutation = useUpdateLoonberekening()

  const [berichtEntry, setBerichtEntry] = useState<BerichtLogEntry | null>(null)
  const [showBericht, setShowBericht] = useState(false)

  const form = useForm<LoonberekeningFormValues>({
    resolver: zodResolver(loonberekeningSchema),
    defaultValues: lbToFormValues(lb),
  })

  const blocker = useUnsavedChangesGuard(form.formState.isDirty)

  const arbeidstijdFields = useFieldArray({
    control: form.control,
    name: 'Arbeidstijdgegevens',
  })

  const loonbeslagFields = useFieldArray({
    control: form.control,
    name: 'LoonbeslagBerekeningen',
  })

  const werkuitkeringEnabled = form.watch('WerkuitkeringBerekening') !== null &&
    form.watch('WerkuitkeringBerekening') !== undefined

  function onSubmit(values: LoonberekeningFormValues) {
    const updated: LoonberekeningBepaald = {
      ...lb,
      RecordDatum: new Date().toISOString(),
      FiscaalJaar: values.FiscaalJaar,
      Loonperiode: values.Loonperiode,
      Berekeningsdatum: values.Berekeningsdatum,
      BerekeningType: values.BerekeningType as BerekeningType,
      Status: values.Status as LoonStatus,
      Arbeidstijdgegevens: values.Arbeidstijdgegevens.map((atg) => ({
        Datum: atg.Datum,
        UrenGewerkt: atg.UrenGewerkt ?? null,
        AfwezigheidsType: (atg.AfwezigheidsType ?? null) as AfwezigheidsType | null,
      })),
      BrutoLoonBerekening: formStapToStap(values.BrutoLoonBerekening),
      RSZBerekening: formStapToStap(values.RSZBerekening),
      BelastbaarInkomenBerekening: formStapToStap(values.BelastbaarInkomenBerekening),
      BVBerekening: formStapToStap(values.BVBerekening),
      BBSZBerekening: formStapToStap(values.BBSZBerekening),
      NettoLoonBerekening: formStapToStap(values.NettoLoonBerekening),
      LoonbeslagBerekeningen: values.LoonbeslagBerekeningen.map((l) => ({
        Omschrijving: l.Omschrijving,
        Bedrag: l.Bedrag,
      })),
      WerkuitkeringBerekening: values.WerkuitkeringBerekening
        ? {
            Instelling: values.WerkuitkeringBerekening.Instelling,
            Bedrag: values.WerkuitkeringBerekening.Bedrag,
            Periode: values.WerkuitkeringBerekening.Periode,
          }
        : null,
      VoorschotBedrag: values.VoorschotBedrag ?? null,
      VoorschotBetaald: values.VoorschotBetaald,
      Meldingen: lb.Meldingen,
      Opmerkingen: values.Opmerkingen ?? null,
      BerichtUrl: values.BerichtUrl ?? null,
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

      {/* ─── Header card ─── */}
      <div className="prato-card mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link
              to={lonenPath(werkgeverReferentieId)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('loonberekening.terug')}
            </Link>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {t('loonberekening.titel')}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {lb.LoonberekeningReferentieId} — {lb.Loonperiode}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Form ─── */}
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} noValidate>

          {/* ─── Action bar ─── */}
          <div className="prato-card mb-6 flex items-center gap-3 flex-wrap">
            <Button
              type="submit"
              disabled={!form.formState.isDirty || updateMutation.isPending}
            >
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
            {berichtEntry !== null && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBericht(true)}
                className="ml-auto flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                {t('loonberekening.bekijk_laatste_bericht')}
              </Button>
            )}
          </div>

          {/* ─── Sectie: Algemeen ─── */}
          <div className="prato-card mb-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('loonberekening.sectie_algemeen')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="FiscaalJaar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('loonberekening.veld_fiscaal_jaar')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Loonperiode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('loonberekening.detail_loonperiode')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2025-01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Berekeningsdatum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('loonberekening.veld_berekeningsdatum')}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="BerekeningType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('loonberekening.veld_berekeningtype')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Normaal">{t('loonberekening.type_normaal')}</SelectItem>
                        <SelectItem value="Correctie">{t('loonberekening.type_correctie')}</SelectItem>
                        <SelectItem value="Simulatie">{t('loonberekening.type_simulatie')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('loonberekening.veld_status')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TeBerekenen">{t('status_badge.TeBerekenen')}</SelectItem>
                        <SelectItem value="TeControleren">{t('status_badge.TeControleren')}</SelectItem>
                        <SelectItem value="Klaargezet">{t('status_badge.Klaargezet')}</SelectItem>
                        <SelectItem value="Afgesloten">{t('status_badge.Afgesloten')}</SelectItem>
                        <SelectItem value="Betaald">{t('status_badge.Betaald')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ─── Sectie: Arbeidstijdgegevens ─── */}
          <div className="prato-card mb-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('loonberekening.sectie_arbeidstijd')}
            </h2>
            {arbeidstijdFields.fields.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b border-border">
                      <th className="text-left pb-2 pr-3 font-medium text-muted-foreground">
                        {t('loonberekening.col_datum')}
                      </th>
                      <th className="text-right pb-2 pr-3 font-medium text-muted-foreground w-28">
                        {t('loonberekening.col_uren')}
                      </th>
                      <th className="text-left pb-2 font-medium text-muted-foreground w-52">
                        {t('loonberekening.col_type')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {arbeidstijdFields.fields.map((field, index) => (
                      <tr key={field.id} className="border-b border-border/50 last:border-0">
                        <td className="py-1.5 pr-3">
                          <FormField
                            control={form.control}
                            name={`Arbeidstijdgegevens.${index}.Datum`}
                            render={({ field: f }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    readOnly
                                    value={f.value}
                                    className="h-8 text-sm bg-muted"
                                    tabIndex={-1}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-1.5 pr-3">
                          <FormField
                            control={form.control}
                            name={`Arbeidstijdgegevens.${index}.UrenGewerkt`}
                            render={({ field: f }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    className="h-8 text-sm text-right"
                                    value={f.value ?? ''}
                                    onChange={(e) =>
                                      f.onChange(
                                        e.target.value === '' ? null : Number(e.target.value),
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-1.5">
                          <FormField
                            control={form.control}
                            name={`Arbeidstijdgegevens.${index}.AfwezigheidsType`}
                            render={({ field: f }) => (
                              <FormItem>
                                <Select
                                  value={f.value ?? GEEN_SENTINEL}
                                  onValueChange={(v) =>
                                    f.onChange(v === GEEN_SENTINEL ? null : (v as AfwezigheidsType))
                                  }
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value={GEEN_SENTINEL}>{t('common.niet_opgegeven')}</SelectItem>
                                    <SelectItem value="Vakantie">{t('loonberekening.afwezig_vakantie')}</SelectItem>
                                    <SelectItem value="Ziekte">{t('loonberekening.afwezig_ziekte')}</SelectItem>
                                    <SelectItem value="FeestdagWettelijk">
                                      {t('loonberekening.afwezig_feestdag')}
                                    </SelectItem>
                                    <SelectItem value="VerlofdagExtra">{t('loonberekening.afwezig_verlofdag')}</SelectItem>
                                    <SelectItem value="Tijdskrediet">{t('loonberekening.afwezig_tijdskrediet')}</SelectItem>
                                    <SelectItem value="Arbeidsongeval">{t('loonberekening.afwezig_arbeidsongeval')}</SelectItem>
                                    <SelectItem value="BeroepsZiekte">{t('loonberekening.afwezig_beroepsziekte')}</SelectItem>
                                    <SelectItem value="Moederschapsverlof">
                                      {t('loonberekening.afwezig_moederschapsverlof')}
                                    </SelectItem>
                                    <SelectItem value="Vaderschapsverlof">
                                      {t('loonberekening.afwezig_vaderschapsverlof')}
                                    </SelectItem>
                                    <SelectItem value="Ouderschapsverlof">
                                      {t('loonberekening.afwezig_ouderschapsverlof')}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('loonberekening.geen_arbeidstijdgegevens')}</p>
            )}
          </div>

          {/* ─── BerekeningsStap sections ─── */}
          <BerekeningsStapSection
            title="Bruto loon"
            fieldName="BrutoLoonBerekening"
            form={form}
          />
          <BerekeningsStapSection
            title="RSZ"
            fieldName="RSZBerekening"
            form={form}
          />
          <BerekeningsStapSection
            title="Belastbaar inkomen"
            fieldName="BelastbaarInkomenBerekening"
            form={form}
          />
          <BerekeningsStapSection
            title="Bedrijfsvoorheffing"
            fieldName="BVBerekening"
            form={form}
          />
          <BerekeningsStapSection
            title="BBSZ"
            fieldName="BBSZBerekening"
            form={form}
          />
          <BerekeningsStapSection
            title="Netto loon"
            fieldName="NettoLoonBerekening"
            form={form}
          />

          {/* ─── Sectie: Loonbeslagen ─── */}
          <div className="prato-card mb-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('loonberekening.sectie_loonbeslagen')}
            </h2>
            {loonbeslagFields.fields.length > 0 ? (
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left pb-2 pr-3 font-medium text-muted-foreground">
                        Omschrijving
                      </th>
                      <th className="text-right pb-2 pr-3 font-medium text-muted-foreground w-36">
                        Bedrag (€)
                      </th>
                      <th className="pb-2 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {loonbeslagFields.fields.map((field, index) => (
                      <tr key={field.id} className="border-b border-border/50 last:border-0">
                        <td className="py-1.5 pr-3">
                          <FormField
                            control={form.control}
                            name={`LoonbeslagBerekeningen.${index}.Omschrijving`}
                            render={({ field: f }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...f} className="h-8 text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-1.5 pr-3">
                          <FormField
                            control={form.control}
                            name={`LoonbeslagBerekeningen.${index}.Bedrag`}
                            render={({ field: f }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    className="h-8 text-sm text-right"
                                    value={f.value}
                                    onChange={(e) => f.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-1.5">
                          <button
                            type="button"
                            onClick={() => loonbeslagFields.remove(index)}
                            className="p-1 rounded text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Loonbeslag verwijderen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-3">{t('loonberekening.geen_loonbeslagen')}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() =>
                loonbeslagFields.append({ Omschrijving: '', Bedrag: 0 })
              }
            >
              <Plus className="h-4 w-4" />
              {t('loonberekening.loonbeslag_toevoegen')}
            </Button>
          </div>

          {/* ─── Sectie: Werkuitkering ─── */}
          <div className="prato-card mb-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('loonberekening.sectie_werkuitkering')}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="werkuitkering-toggle"
                checked={werkuitkeringEnabled}
                onChange={(e) => {
                  if (e.target.checked) {
                    form.setValue(
                      'WerkuitkeringBerekening',
                      { Instelling: '', Bedrag: 0, Periode: '' },
                      { shouldDirty: true },
                    )
                  } else {
                    form.setValue('WerkuitkeringBerekening', null, { shouldDirty: true })
                  }
                }}
                className="h-4 w-4"
              />
              <label htmlFor="werkuitkering-toggle" className="text-sm">
                {t('loonberekening.werkuitkering_van_toepassing')}
              </label>
            </div>
            {werkuitkeringEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="WerkuitkeringBerekening.Instelling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('loonberekening.veld_instelling')}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="WerkuitkeringBerekening.Bedrag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('loonberekening.veld_bedrag')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="WerkuitkeringBerekening.Periode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('loonberekening.veld_periode')}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* ─── Sectie: Voorschot ─── */}
          <div className="prato-card mb-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('loonberekening.sectie_voorschot')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="VoorschotBedrag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('loonberekening.veld_voorschotbedrag')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
                name="VoorschotBetaald"
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
                    <FormLabel className="!mt-0">{t('loonberekening.veld_voorschot_betaald')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ─── Sectie: Opmerkingen ─── */}
          <div className="prato-card mb-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('loonberekening.sectie_opmerkingen')}
            </h2>
            <FormField
              control={form.control}
              name="Opmerkingen"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      rows={4}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      placeholder="Voeg opmerkingen toe…"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </form>
      </Form>

      {/* ─── Sectie: Meldingen (read-only, outside form) ─── */}
      {lb.Meldingen.length > 0 && (
        <div className="prato-card mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
            {t('loonberekening.sectie_meldingen')}
          </h2>
          <div className="flex flex-col gap-3">
            {lb.Meldingen.filter((m) => m.Severity === 'Blokkerend').map((m) => (
              <Alert key={m.Code} variant="destructive">
                <AlertDescription>
                  <span className="font-mono text-xs mr-2">{m.Code}</span>
                  {m.Omschrijving}
                </AlertDescription>
              </Alert>
            ))}
            {lb.Meldingen.filter((m) => m.Severity === 'Waarschuwend').map((m) => (
              <Alert key={m.Code} className="border-amber-400/50 text-amber-700 dark:text-amber-400">
                <AlertDescription>
                  <span className="font-mono text-xs mr-2">{m.Code}</span>
                  {m.Omschrijving}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* ─── BerichtUrl (read-only) ─── */}
      {lb.BerichtUrl !== null && lb.BerichtUrl !== '' && (
        <div className="prato-card mb-6">
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('loonberekening.sectie_bericht')}
          </h2>
          <a
            href={lb.BerichtUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline text-primary hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            {lb.BerichtUrl}
          </a>
        </div>
      )}
    </>
  )
}
