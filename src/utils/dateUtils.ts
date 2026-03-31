import { format, parseISO, isWithinInterval, isValid } from 'date-fns'
import { nl } from 'date-fns/locale'

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '\u2014'
  try {
    const d = parseISO(dateStr)
    if (!isValid(d)) return '\u2014'
    return format(d, 'dd/MM/yyyy', { locale: nl })
  } catch {
    return '\u2014'
  }
}

export function formatDateRange(start: string, end: string | null): string {
  return `${formatDate(start)} \u2013 ${end ? formatDate(end) : 'heden'}`
}

export function buildSnapshotRanges<T extends { AanvangsDatum: string }>(
  snapshots: readonly T[],
): Array<{ snapshot: T; from: string; to: string | null }> {
  const sorted = [...snapshots].sort(
    (a, b) =>
      parseISO(a.AanvangsDatum).getTime() - parseISO(b.AanvangsDatum).getTime(),
  )
  return sorted.map((snapshot, i) => ({
    snapshot,
    from: snapshot.AanvangsDatum,
    to: sorted[i + 1]?.AanvangsDatum ?? null,
  }))
}

export function getActiveSnapshot<T extends { AanvangsDatum: string }>(
  snapshots: readonly T[],
): T | undefined {
  if (snapshots.length === 0) return undefined
  const sorted = [...snapshots].sort(
    (a, b) =>
      parseISO(b.AanvangsDatum).getTime() - parseISO(a.AanvangsDatum).getTime(),
  )
  return sorted[0]
}

export function isDateInPeriod(dateStr: string, van: string, tot: string): boolean {
  try {
    const d = parseISO(dateStr)
    const start = parseISO(van)
    const end = parseISO(tot)
    if (!isValid(d) || !isValid(start) || !isValid(end)) return false
    return isWithinInterval(d, { start, end })
  } catch {
    return false
  }
}
