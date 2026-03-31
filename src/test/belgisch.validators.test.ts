import { describe, it, expect } from 'vitest'
import { validateInsz, validateBelgischIban, validateBtw } from '@/lib/validations/belgisch.schema'

// ─── INSZ ─────────────────────────────────────────────────────────────────────

describe('validateInsz', () => {
  it('aanvaardt een geldig INSZ (voor 2000)', () => {
    // 85.07.30-007.54
    // 850730007 % 97 = 43
    // 97 - 43 = 54
    expect(validateInsz('85073000754')).toBe(true)
  })

  it('aanvaardt een geldig INSZ met scheidingstekens', () => {
    expect(validateInsz('85.07.30-007.54')).toBe(true)
  })

  it('aanvaardt een geldig INSZ (na 2000)', () => {
    // 00.01.01-001.05
    // (2.000.000.000 + 000101001) % 97 = 92
    // 97 - 92 = 05
    expect(validateInsz('00010100105')).toBe(true)
  })

  it('verwerpt INSZ met fout checkgetal', () => {
    expect(validateInsz('85073000799')).toBe(false)
  })

  it('verwerpt te kort INSZ', () => {
    expect(validateInsz('1234')).toBe(false)
  })

  it('verwerpt niet-numeriek INSZ', () => {
    expect(validateInsz('ABCDEFGHIJK')).toBe(false)
  })

  it('verwerpt leeg string', () => {
    expect(validateInsz('')).toBe(false)
  })
})

// ─── IBAN ─────────────────────────────────────────────────────────────────────

describe('validateBelgischIban', () => {
  it('aanvaardt een geldig Belgisch IBAN', () => {
    // Standaard BE68 539007547034
    expect(validateBelgischIban('BE68539007547034')).toBe(true)
  })

  it('aanvaardt IBAN met spaties', () => {
    expect(validateBelgischIban('BE68 5390 0754 7034')).toBe(true)
  })

  it('verwerpt IBAN met fout checkgetal', () => {
    expect(validateBelgischIban('BE00539007547034')).toBe(false)
  })

  it('verwerpt niet-Belgisch IBAN', () => {
    expect(validateBelgischIban('NL91ABNA0417164300')).toBe(false)
  })

  it('verwerpt te kort IBAN', () => {
    expect(validateBelgischIban('BE68')).toBe(false)
  })

  it('verwerpt leeg string', () => {
    expect(validateBelgischIban('')).toBe(false)
  })
})

// ─── BTW ──────────────────────────────────────────────────────────────────────

describe('validateBtw', () => {
  it('aanvaardt een geldig Belgisch BTW-nummer', () => {
    // BE0411905847 — bekende rechtspersoon
    expect(validateBtw('BE0411905847')).toBe(true)
  })

  it('aanvaardt BTW zonder spaties', () => {
    expect(validateBtw('BE0411905847')).toBe(true)
  })

  it('verwerpt BTW met fout checkgetal', () => {
    expect(validateBtw('BE0411905800')).toBe(false)
  })

  it('verwerpt niet-Belgisch BTW', () => {
    expect(validateBtw('NL811234567B01')).toBe(false)
  })

  it('verwerpt te kort BTW-nummer', () => {
    expect(validateBtw('BE012')).toBe(false)
  })

  it('verwerpt leeg string', () => {
    expect(validateBtw('')).toBe(false)
  })
})
