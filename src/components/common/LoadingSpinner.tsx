import { cn } from '@/lib/utils'

interface Props {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ className, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'
  return (
    <div
      role="status"
      aria-label="Laden…"
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClass,
        className,
      )}
    />
  )
}
