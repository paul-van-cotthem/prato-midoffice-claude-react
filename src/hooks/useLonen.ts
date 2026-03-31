import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/config/queryKeys'
import { fetchLonen, updateLoonStatus } from '@/lib/mock/lonen.mock'
import type { LoonStatus } from '@/types/types'

export function useLonen(werkgeverId: string, van: string, tot: string) {
  return useQuery({
    queryKey: queryKeys.lonen(werkgeverId, van, tot),
    queryFn: () => fetchLonen(werkgeverId, van, tot),
    enabled: Boolean(werkgeverId && van && tot),
    placeholderData: keepPreviousData,
  })
}

export function useUpdateLoonStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LoonStatus }) =>
      updateLoonStatus(id, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['lonen'] })
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
