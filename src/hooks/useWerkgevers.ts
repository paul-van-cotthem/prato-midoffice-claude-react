import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/config/queryKeys'
import {
  fetchWerkgevers,
  fetchWerkgever,
  updateWerkgever,
  createWerkgever,
} from '@/lib/mock/werkgever.mock'
import type { WerkgeverGewijzigd } from '@/types/types'
import { generateWerkgeverGewijzigd } from '@/lib/messageGenerator'
import { logBericht } from '@/lib/mock/berichten.mock'

export function useWerkgevers() {
  return useQuery({
    queryKey: queryKeys.werkgevers(),
    queryFn: fetchWerkgevers,
  })
}

export function useWerkgever(id: string) {
  return useQuery({
    queryKey: queryKeys.werkgever(id),
    queryFn: () => fetchWerkgever(id),
    enabled: Boolean(id),
  })
}

export function useUpdateWerkgever() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (werkgever: WerkgeverGewijzigd) => updateWerkgever(werkgever),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.werkgevers() })
      void qc.invalidateQueries({ queryKey: queryKeys.werkgever(data.WerkgeverReferentieId) })
      const bericht = generateWerkgeverGewijzigd(data)
      logBericht({
        type: 'WerkgeverGewijzigd',
        entiteitId: data.WerkgeverReferentieId,
        entiteitNaam:
          data.WerkgeverSnapshots.at(-1)?.MaatschappelijkeNaam ??
          data.WerkgeverReferentieId,
        bericht,
      })
      toast.success('Werkgever opgeslagen')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useCreateWerkgever() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (werkgever: WerkgeverGewijzigd) => createWerkgever(werkgever),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.werkgevers() })
      const bericht = generateWerkgeverGewijzigd(data)
      logBericht({
        type: 'WerkgeverGewijzigd',
        entiteitId: data.WerkgeverReferentieId,
        entiteitNaam:
          data.WerkgeverSnapshots.at(-1)?.MaatschappelijkeNaam ??
          data.WerkgeverReferentieId,
        bericht,
      })
      toast.success('Werkgever aangemaakt')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
