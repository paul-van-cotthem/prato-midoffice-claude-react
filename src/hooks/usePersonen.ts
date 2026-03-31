import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/config/queryKeys'
import {
  fetchPersonen,
  fetchPersoon,
  updatePersoon,
  createPersoon,
} from '@/lib/mock/persoon.mock'
import type { PersoonGewijzigd } from '@/types/types'
import { generatePersoonGewijzigd } from '@/lib/messageGenerator'
import { logBericht } from '@/lib/mock/berichten.mock'

export function usePersonen(werkgeverId: string) {
  return useQuery({
    queryKey: queryKeys.personen(werkgeverId),
    queryFn: () => fetchPersonen(werkgeverId),
    enabled: Boolean(werkgeverId),
  })
}

export function usePersoon(id: string) {
  return useQuery({
    queryKey: queryKeys.persoon(id),
    queryFn: () => fetchPersoon(id),
    enabled: Boolean(id),
  })
}

export function useUpdatePersoon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (persoon: PersoonGewijzigd) => updatePersoon(persoon),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.personen(data.WerkgeverReferentieId) })
      void qc.invalidateQueries({ queryKey: queryKeys.persoon(data.PersoonReferentieId) })
      const bericht = generatePersoonGewijzigd(data)
      const activeSnapshot = data.PersoonSnapshots.at(-1)
      logBericht({
        type: 'PersoonGewijzigd',
        entiteitId: data.PersoonReferentieId,
        entiteitNaam: activeSnapshot
          ? `${activeSnapshot.FamilieNaam} ${activeSnapshot.Voornaam}`
          : data.PersoonReferentieId,
        bericht,
      })
      toast.success('Persoon opgeslagen')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useCreatePersoon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (persoon: PersoonGewijzigd) => createPersoon(persoon),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.personen(data.WerkgeverReferentieId) })
      const bericht = generatePersoonGewijzigd(data)
      const activeSnapshot = data.PersoonSnapshots.at(-1)
      logBericht({
        type: 'PersoonGewijzigd',
        entiteitId: data.PersoonReferentieId,
        entiteitNaam: activeSnapshot
          ? `${activeSnapshot.FamilieNaam} ${activeSnapshot.Voornaam}`
          : data.PersoonReferentieId,
        bericht,
      })
      toast.success('Persoon aangemaakt')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
