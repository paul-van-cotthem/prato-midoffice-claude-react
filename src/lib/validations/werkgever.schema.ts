import { z } from 'zod'

// ─── Belgische validators ────────────────────────────────────────────────────

const optionalString = z.string().nullable().optional()

// Belgische postcode: 4 cijfers, 1000-9999
const belgischPostcodeSchema = z
  .string()
  .regex(/^\d{4}$/, 'Ongeldige postcode')
  .refine((v) => parseInt(v, 10) >= 1000, 'Postcode moet tussen 1000 en 9999 liggen')

// BIC: 8 of 11 alfanumerieke tekens
const bicSchema = z
  .string()
  .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Ongeldig BIC')
  .or(z.literal(''))
  .nullable()
  .optional()

// Email optioneel
const emailSchema = z.string().email('Ongeldig e-mailadres').or(z.literal('')).nullable().optional()

// ─── Adres schema ────────────────────────────────────────────────────────────

export const adresSchema = z.object({
  Straat: z.string().min(1, 'Straat is verplicht'),
  Huisnummer: z.string().min(1, 'Huisnummer is verplicht'),
  Bus: z.string().nullable().optional(),
  Gemeente: z.string().min(1, 'Gemeente is verplicht'),
  PostCode: belgischPostcodeSchema,
  Land: z.string().min(1, 'Land is verplicht'),
})

// ─── Paritair comité schema ──────────────────────────────────────────────────

export const paritairComiteSchema = z.object({
  Code: z.string().min(1, 'Code is verplicht'),
  Omschrijving: z.string().min(1, 'Omschrijving is verplicht'),
})

// ─── WerkgeverSnapshot formulier schema ──────────────────────────────────────

export const werkgeverSnapshotSchema = z.object({
  AanvangsDatum: z.string().min(1, 'Aanvangsdatum is verplicht'),
  OndernemingsNummer: z.string().min(1, 'Ondernemingsnummer is verplicht'),
  RSZNummer: z.string().min(1, 'RSZ-nummer is verplicht'),
  BTWNummer: optionalString,
  RechtspersonenRegister: optionalString,
  MaatschappelijkeNaam: z.string().min(1, 'Naam is verplicht'),
  Vennootschapsvorm: optionalString,
  Taal: z.enum(['Nederlands', 'Frans']),
  Periodiciteit: z.enum(['Maandelijks', 'Tweewekelijks', 'Wekelijks', 'Dagelijks']),
  Adres: adresSchema,
  Email: emailSchema,
  Telefoon: optionalString,
  Website: optionalString,
  IBAN: optionalString,
  BIC: bicSchema,
  IBANLonen: optionalString,
  BICLonen: bicSchema,
  ParitaireComites: z.array(paritairComiteSchema),
  BetaaltBvZelf: z.boolean(),
  VrijstellingPloegenarbeid: z.boolean(),
  VrijstellingNachtarbeid: z.boolean(),
  VrijstellingVolContinu: z.boolean(),
  VrijstellingOnroerendeStaat: z.boolean(),
  ChequeLeverancier: optionalString,
  WerkgeversbijdrageMaaltijdcheque: z.number().nullable().optional(),
  NotieCuratele: z.boolean(),
  Erkenningsnummer: optionalString,
  BegindatumVakantieperiode: optionalString,
})

export type WerkgeverSnapshotFormValues = z.infer<typeof werkgeverSnapshotSchema>
