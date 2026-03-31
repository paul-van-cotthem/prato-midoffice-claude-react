import type {
  ContractGewijzigd,
  LoonberekeningBepaald,
  PersoonGewijzigd,
  WerkgeverGewijzigd,
} from '@/types/types'

export function generatePersoonGewijzigd(persoon: PersoonGewijzigd): PersoonGewijzigd {
  return { ...persoon, RecordDatum: new Date().toISOString() }
}

export function generateContractGewijzigd(contract: ContractGewijzigd): ContractGewijzigd {
  return { ...contract, RecordDatum: new Date().toISOString() }
}

export function generateWerkgeverGewijzigd(werkgever: WerkgeverGewijzigd): WerkgeverGewijzigd {
  return { ...werkgever, RecordDatum: new Date().toISOString() }
}

export function generateLoonberekeningBepaald(
  lb: LoonberekeningBepaald,
): LoonberekeningBepaald {
  return { ...lb, RecordDatum: new Date().toISOString() }
}
