import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/mock/storage'

export interface BerichtLogEntry {
  readonly id: string
  readonly type:
    | 'PersoonGewijzigd'
    | 'ContractGewijzigd'
    | 'WerkgeverGewijzigd'
    | 'LoonberekeningBepaald'
  readonly timestamp: string
  readonly entiteitId: string
  readonly entiteitNaam: string
  readonly bericht: unknown
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function logBericht(
  entry: Omit<BerichtLogEntry, 'id' | 'timestamp'>,
): BerichtLogEntry {
  const newEntry: BerichtLogEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date().toISOString(),
  }
  const existing = fetchBerichten()
  saveToStorage(STORAGE_KEYS.BERICHTEN_LOG, [newEntry, ...existing])
  return newEntry
}

export function fetchBerichten(): BerichtLogEntry[] {
  return loadFromStorage<BerichtLogEntry[]>(STORAGE_KEYS.BERICHTEN_LOG, [])
}

export function clearBerichten(): void {
  saveToStorage(STORAGE_KEYS.BERICHTEN_LOG, [])
}
