import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/mock/storage'
import { loonberekeningenData } from '@/lib/mock/data/loonberekeningen'
import type { LoonberekeningBepaald } from '@/types/types'

const delay = (): Promise<void> => new Promise<void>((r) => setTimeout(r, 300))

function getAll(): LoonberekeningBepaald[] {
  return loadFromStorage<LoonberekeningBepaald[]>(
    STORAGE_KEYS.LOONBEREKENINGEN,
    loonberekeningenData,
  )
}

/**
 * Returns loonberekeningen for a werkgever where the Loonperiode (format "YYYY-MM")
 * falls within the range [van, tot] (format "YYYY-MM").
 */
export async function fetchLoonberekeningen(
  werkgeverId: string,
  van: string,
  tot: string,
): Promise<LoonberekeningBepaald[]> {
  await delay()
  // Loonperiode is "YYYY-MM"; van/tot are "YYYY-MM-DD" — compare only YYYY-MM prefix
  const vanMonth = van.slice(0, 7)
  const totMonth = tot.slice(0, 7)
  return getAll().filter((lb) => {
    if (lb.WerkgeverReferentieId !== werkgeverId) return false
    return lb.Loonperiode >= vanMonth && lb.Loonperiode <= totMonth
  })
}

export async function fetchLoonberekening(id: string): Promise<LoonberekeningBepaald> {
  await delay()
  const found = getAll().find((lb) => lb.LoonberekeningReferentieId === id)
  if (!found) throw new Error(`Loonberekening ${id} niet gevonden`)
  return found
}

export async function updateLoonberekening(
  lb: LoonberekeningBepaald,
): Promise<LoonberekeningBepaald> {
  await delay()
  const all = getAll()
  const idx = all.findIndex(
    (l) => l.LoonberekeningReferentieId === lb.LoonberekeningReferentieId,
  )
  const updated =
    idx >= 0
      ? all.map((l, i) => (i === idx ? lb : l))
      : [...all, lb]
  saveToStorage(STORAGE_KEYS.LOONBEREKENINGEN, updated)
  return lb
}
