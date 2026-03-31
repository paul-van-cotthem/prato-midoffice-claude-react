import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/config/queryKeys'
import {
  fetchLoonberekening,
  updateLoonberekening,
} from '@/lib/mock/loonberekening.mock'
import type { LoonberekeningBepaald } from '@/types/types'
import { generateLoonberekeningBepaald } from '@/lib/messageGenerator'
import { logBericht } from '@/lib/mock/berichten.mock'

export function useLoonberekening(id: string) {
  return useQuery({
    queryKey: queryKeys.loonberekening(id),
    queryFn: () => fetchLoonberekening(id),
    enabled: Boolean(id),
  })
}

export function useUpdateLoonberekening() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (lb: LoonberekeningBepaald) => updateLoonberekening(lb),
    onSuccess: (data) => {
      void qc.invalidateQueries({
        queryKey: queryKeys.loonberekening(data.LoonberekeningReferentieId),
      })
      void qc.invalidateQueries({ queryKey: ['lonen'] })
      const bericht = generateLoonberekeningBepaald(data)
      logBericht({
        type: 'LoonberekeningBepaald',
        entiteitId: data.LoonberekeningReferentieId,
        entiteitNaam: `${data.Loonperiode} — ${data.PersoonReferentieId}`,
        bericht,
      })
      toast.success('Loonberekening opgeslagen')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
