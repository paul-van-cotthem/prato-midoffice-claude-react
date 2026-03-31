export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    if (err instanceof Error && err.name === 'QuotaExceededError') {
      console.warn('[Prato] localStorage quota exceeded. Changes may not be saved.')
    } else {
      throw err
    }
  }
}

export function clearStorage(key: string): void {
  localStorage.removeItem(key)
}

export const STORAGE_KEYS = {
  WERKGEVERS: 'prato_werkgevers',
  PERSONEN: 'prato_personen',
  CONTRACTEN: 'prato_contracten',
  LOONBEREKENINGEN: 'prato_loonberekeningen',
  LOON_STATUSSEN: 'prato_loon_statussen',
  BERICHTEN_LOG: 'prato_berichten_log',
} as const
