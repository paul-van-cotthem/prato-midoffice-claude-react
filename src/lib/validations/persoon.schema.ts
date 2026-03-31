import { z } from 'zod'
import { inszSchema } from './belgisch.schema'

const optStr = z.string().nullable().optional()
const optNum = z.number().nullable().optional()

export const persoonSnapshotSchema = z
  .object({
    AanvangsDatum: z.string().min(1, 'Aanvangsdatum is verplicht'),
    INSZNummer: inszSchema,
    FamilieNaam: z.string().min(1, 'Familienaam is verplicht'),
    Voornaam: z.string().min(1, 'Voornaam is verplicht'),
    Geslacht: z.enum(['Man', 'Vrouw', 'X']),
    Geboortedatum: optStr,
    GeboortePlaats: optStr,
    Taal: z.enum(['Nederlands', 'Frans']),
    Straat: z.string().min(1, 'Straat is verplicht'),
    Huisnummer: z.string().min(1, 'Huisnummer is verplicht'),
    Bus: optStr,
    Gemeente: z.string().min(1, 'Gemeente is verplicht'),
    PostCode: z.string().min(1, 'Postcode is verplicht'),
    Land: z.string().min(1, 'Land is verplicht'),
    IBAN: optStr,
    BIC: optStr,
    EmailLoonbrief: z.string().email('Ongeldig e-mailadres').or(z.literal('')).nullable().optional(),
    BurgerlijkeStaat: z
      .enum([
        'Ongehuwd', 'Gehuwd', 'Weduwe', 'WettelijkGescheiden',
        'FeitelijkGescheiden', 'Samenwonend', 'FeitelijkSamenwonend', 'ScheidingVanTafelEnBed',
      ])
      .nullable()
      .optional(),
    TypeBvBerekening: z.enum(['VastPercentage', 'Schalen']).nullable().optional(),
    VastBvPercentage: optNum,
    Mindervalide: z.boolean().nullable().optional(),
    PartnerInkomsten: z
      .enum([
        'EigenInkomsten', 'EigenInkomstenOnderGrens3', 'EigenInkomstenOnderGrens2',
        'EigenInkomstenOnderGrens1', 'GeenEigenInkomsten',
      ])
      .nullable()
      .optional(),
    PartnerMindervalide: z.boolean().nullable().optional(),
    AantalKinderenTenLaste: optNum,
    AantalMindervalideKinderenTenLaste: optNum,
    AantalOuderePersonenTenLaste: optNum,
    AantalMindervalideOuderePersonenTenLaste: optNum,
    AantalAnderePersonenTenLaste: optNum,
    AantalAndereMindervalidePersonenTenLaste: optNum,
    AantalZorgbehoevendeOuderePersonenTenLaste: optNum,
    DatumInDienst: optStr,
    GepensioneerdVanaf: optStr,
    Werknemerskengetallen: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (
      data.TypeBvBerekening === 'VastPercentage' &&
      (data.VastBvPercentage === null || data.VastBvPercentage === undefined)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vast BV-percentage is verplicht bij type VastPercentage',
        path: ['VastBvPercentage'],
      })
    }
  })

export type PersoonSnapshotFormValues = z.infer<typeof persoonSnapshotSchema>
