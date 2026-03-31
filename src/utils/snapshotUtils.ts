import { parseISO } from 'date-fns'

export function getActiveSnapshot<T extends { AanvangsDatum: string }>(
  snapshots: readonly T[],
): T | undefined {
  if (snapshots.length === 0) return undefined
  return [...snapshots].sort(
    (a, b) =>
      parseISO(b.AanvangsDatum).getTime() - parseISO(a.AanvangsDatum).getTime(),
  )[0]
}

export function prefillNewSnapshot<T extends { AanvangsDatum: string }>(
  snapshots: readonly T[],
): Omit<T, 'AanvangsDatum'> & { AanvangsDatum: null } {
  const latest = getActiveSnapshot(snapshots)
  if (latest === undefined) {
    return { AanvangsDatum: null } as Omit<T, 'AanvangsDatum'> & { AanvangsDatum: null }
  }
  const { AanvangsDatum: _ignored, ...rest } = latest
  void _ignored
  return {
    ...(rest as Omit<T, 'AanvangsDatum'>),
    AanvangsDatum: null,
  }
}
