import { describe, it, expect } from 'vitest'
import { getActiveSnapshot, prefillNewSnapshot } from '@/utils/snapshotUtils'

interface TestSnap {
  AanvangsDatum: string
  Naam: string
}

const snap1: TestSnap = { AanvangsDatum: '2023-01-01', Naam: 'Eerste' }
const snap2: TestSnap = { AanvangsDatum: '2024-06-15', Naam: 'Tweede' }
const snap3: TestSnap = { AanvangsDatum: '2022-03-10', Naam: 'Derde' }

// ─── getActiveSnapshot ────────────────────────────────────────────────────────

describe('getActiveSnapshot', () => {
  it('geeft de snapshot met de meest recente AanvangsDatum', () => {
    const result = getActiveSnapshot([snap1, snap2, snap3])
    expect(result?.Naam).toBe('Tweede')
  })

  it('geeft de enige snapshot terug als er maar één is', () => {
    const result = getActiveSnapshot([snap1])
    expect(result?.Naam).toBe('Eerste')
  })

  it('geeft undefined terug bij lege array', () => {
    const result = getActiveSnapshot([])
    expect(result).toBeUndefined()
  })

  it('verandert de originele array niet (pure function)', () => {
    const arr = [snap1, snap2, snap3]
    getActiveSnapshot(arr)
    expect(arr[0].Naam).toBe('Eerste') // volgorde ongewijzigd
  })
})

// ─── prefillNewSnapshot ───────────────────────────────────────────────────────

describe('prefillNewSnapshot', () => {
  it('kopieert de meest recente snapshot met AanvangsDatum null', () => {
    const result = prefillNewSnapshot([snap1, snap2, snap3])
    expect(result.AanvangsDatum).toBeNull()
    expect(result.Naam).toBe('Tweede') // komt van de meest recente
  })

  it('geeft enkel AanvangsDatum: null terug bij lege array', () => {
    const result = prefillNewSnapshot<TestSnap>([])
    expect(result.AanvangsDatum).toBeNull()
  })

  it('geeft een nieuw object terug (geen referentie naar origineel)', () => {
    const result = prefillNewSnapshot([snap2])
    expect(result).not.toBe(snap2)
  })
})
