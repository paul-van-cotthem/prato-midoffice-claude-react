import { z } from 'zod'

// ─── INSZ ────────────────────────────────────────────────────────────────────
// Formaat: 11 cijfers (YY.MM.DD-NNN.CC of zonder scheidingstekens)
// Algoritme: 97 - (de eerste 9 cijfers als getal, of +2 miljard voor 2000+) MOD 97
// moet gelijk zijn aan de 2 controlecijfers.

export function validateInsz(raw: string): boolean {
  const digits = raw.replace(/[\s.-]/g, '')
  if (!/^\d{11}$/.test(digits)) return false

  const [base, check] = [digits.slice(0, 9), parseInt(digits.slice(9), 10)]

  // Probeer eerst zonder correctie (geboortejaar < 2000)
  const mod1 = parseInt(base, 10) % 97
  const check1 = 97 - (mod1 === 0 ? 97 : mod1)
  if (check1 === check) return true

  // Probeer met correctie (geboortejaar >= 2000)
  const mod2 = (2_000_000_000 + parseInt(base, 10)) % 97
  const check2 = 97 - (mod2 === 0 ? 97 : mod2)
  return check2 === check
}

// ─── Belgisch IBAN ────────────────────────────────────────────────────────────
// Formaat: BE + 2 controlecijfers + 12 rekeningcijfers
// MOD-97 op herrangschikte IBAN (cijfers naar achter, letters omgezet)

export function validateBelgischIban(raw: string): boolean {
  const iban = raw.replace(/\s/g, '').toUpperCase()
  if (!/^BE\d{14}$/.test(iban)) return false

  // Herrangschik: move first 4 chars to end
  const rearranged = iban.slice(4) + iban.slice(0, 4)
  // Convert letters to numbers (A=10, B=11, … Z=35)
  const numeric = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55))
  // MOD-97 using BigInt to handle large numbers
  return BigInt(numeric) % 97n === 1n
}

// ─── Belgisch BTW ────────────────────────────────────────────────────────────
// Formaat: BE + 10 cijfers (of BE0 + 9 cijfers)
// Controlegetal: 97 - (eerste 8 cijfers MOD 97) === laatste 2 cijfers

export function validateBtw(raw: string): boolean {
  const normalized = raw.replace(/[\s.]/g, '').toUpperCase()
  if (!/^BE\d{10}$/.test(normalized)) return false

  const digits = normalized.slice(2) // 10 cijfers
  const base = parseInt(digits.slice(0, 8), 10)
  const check = parseInt(digits.slice(8), 10)
  const expected = 97 - (base % 97)
  return expected === check
}

// ─── Zod schemas ─────────────────────────────────────────────────────────────

export const inszSchema = z
  .string()
  .min(1, 'INSZ-nummer is verplicht')
  .refine(validateInsz, { message: 'Ongeldig INSZ-nummer' })

export const inszOptionalSchema = z
  .string()
  .refine((v) => v === '' || validateInsz(v), { message: 'Ongeldig INSZ-nummer' })
  .or(z.literal(''))
  .nullable()
  .optional()

export const belgischIbanSchema = z
  .string()
  .refine((v) => v === '' || validateBelgischIban(v), { message: 'Ongeldig Belgisch IBAN' })
  .or(z.literal(''))
  .nullable()
  .optional()

export const btwNummerSchema = z
  .string()
  .refine((v) => v === '' || v === null || v === undefined || validateBtw(v as string), {
    message: 'Ongeldig BTW-nummer',
  })
  .nullable()
  .optional()
