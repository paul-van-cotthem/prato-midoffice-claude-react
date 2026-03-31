import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/mock/storage'
import { personenData } from '@/lib/mock/data/personen'
import type { PersoonGewijzigd } from '@/types/types'

const delay = (): Promise<void> => new Promise<void>((r) => setTimeout(r, 300))

function getAll(): PersoonGewijzigd[] {
  return loadFromStorage<PersoonGewijzigd[]>(STORAGE_KEYS.PERSONEN, personenData)
}

export async function fetchPersonen(werkgeverId: string): Promise<PersoonGewijzigd[]> {
  await delay()
  return getAll().filter((p) => p.WerkgeverReferentieId === werkgeverId)
}

export async function fetchPersoon(id: string): Promise<PersoonGewijzigd> {
  await delay()
  const found = getAll().find((p) => p.PersoonReferentieId === id)
  if (!found) throw new Error(`Persoon ${id} niet gevonden`)
  return found
}

export async function updatePersoon(persoon: PersoonGewijzigd): Promise<PersoonGewijzigd> {
  await delay()
  const all = getAll()
  const idx = all.findIndex((p) => p.PersoonReferentieId === persoon.PersoonReferentieId)
  const updated =
    idx >= 0
      ? all.map((p, i) => (i === idx ? persoon : p))
      : [...all, persoon]
  saveToStorage(STORAGE_KEYS.PERSONEN, updated)
  return persoon
}

export async function createPersoon(persoon: PersoonGewijzigd): Promise<PersoonGewijzigd> {
  await delay()
  const all = getAll()
  const newEntry: PersoonGewijzigd = {
    ...persoon,
    PersoonReferentieId: `PERS-${Date.now()}`,
  }
  saveToStorage(STORAGE_KEYS.PERSONEN, [...all, newEntry])
  return newEntry
}
