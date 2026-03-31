import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/mock/storage'
import { contractenData } from '@/lib/mock/data/contracten'
import type { ContractGewijzigd } from '@/types/types'

const delay = (): Promise<void> => new Promise<void>((r) => setTimeout(r, 300))

function getAll(): ContractGewijzigd[] {
  return loadFromStorage<ContractGewijzigd[]>(STORAGE_KEYS.CONTRACTEN, contractenData)
}

export async function fetchContracten(persoonId: string): Promise<ContractGewijzigd[]> {
  await delay()
  return getAll().filter((c) => c.PersoonReferentieId === persoonId)
}

export async function fetchContract(id: string): Promise<ContractGewijzigd> {
  await delay()
  const found = getAll().find((c) => c.ContractReferentieId === id)
  if (!found) throw new Error(`Contract ${id} niet gevonden`)
  return found
}

export async function updateContract(
  contract: ContractGewijzigd,
): Promise<ContractGewijzigd> {
  await delay()
  const all = getAll()
  const idx = all.findIndex(
    (c) => c.ContractReferentieId === contract.ContractReferentieId,
  )
  const updated =
    idx >= 0
      ? all.map((c, i) => (i === idx ? contract : c))
      : [...all, contract]
  saveToStorage(STORAGE_KEYS.CONTRACTEN, updated)
  return contract
}

export async function createContract(
  contract: ContractGewijzigd,
): Promise<ContractGewijzigd> {
  await delay()
  const all = getAll()
  const newEntry: ContractGewijzigd = {
    ...contract,
    ContractReferentieId: `CONT-${Date.now()}`,
  }
  saveToStorage(STORAGE_KEYS.CONTRACTEN, [...all, newEntry])
  return newEntry
}
