import type { LoonStatus, LonenOverzichtRij } from '@/types/types'
import { fetchLoonberekeningen } from '@/lib/mock/loonberekening.mock'
import { fetchPersonen } from '@/lib/mock/persoon.mock'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/mock/storage'

export async function fetchLonen(
  werkgeverId: string,
  van: string,
  tot: string,
): Promise<LonenOverzichtRij[]> {
  const [berekeningen, personen] = await Promise.all([
    fetchLoonberekeningen(werkgeverId, van, tot),
    fetchPersonen(werkgeverId),
  ])

  const statusOverrides = loadFromStorage<Record<string, string>>(
    STORAGE_KEYS.LOON_STATUSSEN,
    {},
  )

  return berekeningen.map((lb): LonenOverzichtRij => {
    const persoon = personen.find((p) => p.PersoonReferentieId === lb.PersoonReferentieId)
    const activeSnapshot =
      persoon !== undefined
        ? persoon.PersoonSnapshots[persoon.PersoonSnapshots.length - 1]
        : undefined

    const rawStatus = statusOverrides[lb.LoonberekeningReferentieId] ?? lb.Status

    return {
      persoonReferentieId: lb.PersoonReferentieId,
      contractReferentieId: lb.ContractReferentieId,
      loonberekeningReferentieId: lb.LoonberekeningReferentieId,
      familieNaam: activeSnapshot?.FamilieNaam ?? '',
      voornaam: activeSnapshot?.Voornaam ?? '',
      arbeidsstelsel: 'Voltijds',
      status: rawStatus as LoonStatus,
      aantalBlokkerende: lb.Meldingen.filter((m) => m.Severity === 'Blokkerend').length,
      aantalWaarschuwende: lb.Meldingen.filter((m) => m.Severity === 'Waarschuwend').length,
      loonperiode: lb.Loonperiode,
    }
  })
}

export async function updateLoonStatus(
  loonberekeningId: string,
  status: LoonStatus,
): Promise<void> {
  await new Promise<void>((r) => setTimeout(r, 300))
  const overrides = loadFromStorage<Record<string, string>>(
    STORAGE_KEYS.LOON_STATUSSEN,
    {},
  )
  saveToStorage(STORAGE_KEYS.LOON_STATUSSEN, {
    ...overrides,
    [loonberekeningId]: status,
  })
}
