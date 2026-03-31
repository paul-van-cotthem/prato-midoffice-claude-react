import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/mock/storage'
import { werkgeversData } from '@/lib/mock/data/werkgevers'
import type { WerkgeverGewijzigd } from '@/types/types'

const delay = (): Promise<void> => new Promise<void>((r) => setTimeout(r, 300))

function getAll(): WerkgeverGewijzigd[] {
  return loadFromStorage<WerkgeverGewijzigd[]>(STORAGE_KEYS.WERKGEVERS, werkgeversData)
}

export async function fetchWerkgevers(): Promise<WerkgeverGewijzigd[]> {
  await delay()
  return getAll()
}

export async function fetchWerkgever(id: string): Promise<WerkgeverGewijzigd> {
  await delay()
  const found = getAll().find((w) => w.WerkgeverReferentieId === id)
  if (!found) throw new Error(`Werkgever ${id} niet gevonden`)
  return found
}

export async function updateWerkgever(
  werkgever: WerkgeverGewijzigd,
): Promise<WerkgeverGewijzigd> {
  await delay()
  const all = getAll()
  const idx = all.findIndex(
    (w) => w.WerkgeverReferentieId === werkgever.WerkgeverReferentieId,
  )
  const updated =
    idx >= 0
      ? all.map((w, i) => (i === idx ? werkgever : w))
      : [...all, werkgever]
  saveToStorage(STORAGE_KEYS.WERKGEVERS, updated)
  return werkgever
}

export async function createWerkgever(
  werkgever: WerkgeverGewijzigd,
): Promise<WerkgeverGewijzigd> {
  await delay()
  const all = getAll()
  const newEntry: WerkgeverGewijzigd = {
    ...werkgever,
    WerkgeverReferentieId: `WG-${Date.now()}`,
  }
  saveToStorage(STORAGE_KEYS.WERKGEVERS, [...all, newEntry])
  return newEntry
}
