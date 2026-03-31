import { z } from 'zod'

const optStr = z.string().nullable().optional()
const optNum = z.number().nullable().optional()

export const contractSnapshotSchema = z
  .object({
    AanvangsDatum: z.string().min(1, 'Aanvangsdatum is verplicht'),
    BeginDatum: z.string().min(1, 'Begindatum is verplicht'),
    EindDatum: optStr,
    ParitairComite: z.string().min(1, 'Paritair comité is verplicht'),
    Gewest: z.enum(['Vlaanderen', 'Wallonie', 'Brussel']),
    WerknemersStatuut: z.enum(['Arbeider', 'Bediende', 'Kader', 'Directeur']),
    Functie: optStr,
    TypeWerknemerDimona: optStr,
    Tikkaartnummer: optStr,
    Arbeidsstelsel: z.enum(['Voltijds', 'Deeltijds', 'Flexi', 'Jobstudent']),
    TypeContract: z.enum(['OnbepaaldeDuur', 'BepaaldeDuur', 'Vervangingscontract', 'Uitvoering']),
    VerloningsPeriodiciteit: z.enum(['Maandelijks', 'Tweewekelijks', 'Wekelijks']),
    Bezoldigingswijze: z.enum(['UurLoon', 'MaandLoon', 'DagLoon']),
    VoltijdsReferentieRegime: optNum,
    TypeForfait: z.enum(['Geen', 'Klein', 'Groot']),
    Taalgebied: z.enum(['Nederlandstalig', 'Franstalig', 'Duitstalig', 'Tweetalig']),
    LoonBedrag: optNum,
    LoonMunt: z.string().min(1, 'Munt is verplicht'),
    WerkgeversbijdrageMaaltijdcheque: optNum,
    MaaltijdchequesManueelToegekend: z.boolean(),
    StarterJob: z.boolean(),
    VrijstellingPloegenarbeid: z.boolean(),
    VrijstellingNachtarbeid: z.boolean(),
    VrijstellingVolContinu: z.boolean(),
    VrijstellingOnroerendeStaat: z.boolean(),
    VrijstellingPloegenarbeidBIS: z.boolean(),
    VrijstellingVolContinuBIS: z.boolean(),
    BuitenlandseLoonbelasting: z.boolean(),
    NotieLaattijdigeFlexi: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.EindDatum && data.BeginDatum && data.EindDatum < data.BeginDatum) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Einddatum moet na de begindatum liggen',
        path: ['EindDatum'],
      })
    }
  })

export type ContractSnapshotFormValues = z.infer<typeof contractSnapshotSchema>
