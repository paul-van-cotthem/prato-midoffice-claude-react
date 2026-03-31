import { z } from 'zod'

const berekeningsRegelSchema = z.object({
  Omschrijving: z.string(),
  Bedrag: z.number(),
  IsTotaal: z.boolean(),
})

const berekeningsStapSchema = z.object({
  Naam: z.string(),
  Regels: z.array(berekeningsRegelSchema),
  Totaal: z.number(),
})

const arbeidstijdgegevenSchema = z.object({
  Datum: z.string(),
  UrenGewerkt: z.number().nullable().optional(),
  AfwezigheidsType: z
    .enum([
      'Vakantie',
      'Ziekte',
      'FeestdagWettelijk',
      'VerlofdagExtra',
      'Tijdskrediet',
      'Arbeidsongeval',
      'BeroepsZiekte',
      'Moederschapsverlof',
      'Vaderschapsverlof',
      'Ouderschapsverlof',
    ])
    .nullable()
    .optional(),
})

const loonbeslagBerekeningSchema = z.object({
  Omschrijving: z.string().min(1, 'Omschrijving is verplicht'),
  Bedrag: z.number(),
})

const werkuitkeringBerekeningSchema = z.object({
  Instelling: z.string().min(1),
  Bedrag: z.number(),
  Periode: z.string().min(1),
})

export const loonberekeningSchema = z.object({
  FiscaalJaar: z.number(),
  Loonperiode: z.string().min(1, 'Loonperiode is verplicht'),
  Berekeningsdatum: z.string().min(1, 'Berekeningsdatum is verplicht'),
  BerekeningType: z.enum(['Normaal', 'Correctie', 'Simulatie']),
  Status: z.enum(['TeBerekenen', 'TeControleren', 'Klaargezet', 'Afgesloten', 'Betaald']),
  Arbeidstijdgegevens: z.array(arbeidstijdgegevenSchema),
  BrutoLoonBerekening: berekeningsStapSchema,
  RSZBerekening: berekeningsStapSchema,
  BelastbaarInkomenBerekening: berekeningsStapSchema,
  BVBerekening: berekeningsStapSchema,
  BBSZBerekening: berekeningsStapSchema,
  NettoLoonBerekening: berekeningsStapSchema,
  LoonbeslagBerekeningen: z.array(loonbeslagBerekeningSchema),
  WerkuitkeringBerekening: werkuitkeringBerekeningSchema.nullable().optional(),
  VoorschotBedrag: z.number().nullable().optional(),
  VoorschotBetaald: z.boolean(),
  Opmerkingen: z.string().nullable().optional(),
  BerichtUrl: z.string().nullable().optional(),
})

export type LoonberekeningFormValues = z.infer<typeof loonberekeningSchema>
