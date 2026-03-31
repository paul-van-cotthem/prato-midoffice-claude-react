import { useBlocker } from 'react-router-dom'

export function useUnsavedChangesGuard(isDirty: boolean) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  )
  return blocker
}
