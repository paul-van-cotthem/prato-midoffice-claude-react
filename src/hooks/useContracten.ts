import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/config/queryKeys'
import {
  fetchContracten,
  fetchContract,
  updateContract,
  createContract,
} from '@/lib/mock/contract.mock'
import type { ContractGewijzigd } from '@/types/types'
import { generateContractGewijzigd } from '@/lib/messageGenerator'
import { logBericht } from '@/lib/mock/berichten.mock'

export function useContracten(persoonId: string) {
  return useQuery({
    queryKey: queryKeys.contracten(persoonId),
    queryFn: () => fetchContracten(persoonId),
    enabled: Boolean(persoonId),
  })
}

export function useContract(id: string) {
  return useQuery({
    queryKey: queryKeys.contract(id),
    queryFn: () => fetchContract(id),
    enabled: Boolean(id),
  })
}

export function useUpdateContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (contract: ContractGewijzigd) => updateContract(contract),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.contracten(data.PersoonReferentieId) })
      void qc.invalidateQueries({ queryKey: queryKeys.contract(data.ContractReferentieId) })
      const bericht = generateContractGewijzigd(data)
      logBericht({
        type: 'ContractGewijzigd',
        entiteitId: data.ContractReferentieId,
        entiteitNaam: data.ContractReferentieId,
        bericht,
      })
      toast.success('Contract opgeslagen')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useCreateContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (contract: ContractGewijzigd) => createContract(contract),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.contracten(data.PersoonReferentieId) })
      const bericht = generateContractGewijzigd(data)
      logBericht({
        type: 'ContractGewijzigd',
        entiteitId: data.ContractReferentieId,
        entiteitNaam: data.ContractReferentieId,
        bericht,
      })
      toast.success('Contract aangemaakt')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
