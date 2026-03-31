import * as React from 'react'
import { cn } from '@/lib/utils'

type AlertVariant = 'default' | 'destructive'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

const variantClasses: Record<AlertVariant, string> = {
  default: 'bg-background text-foreground border',
  destructive:
    'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10',
}

export function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px]',
        '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
        '[&>svg~*]:pl-7',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
Alert.displayName = 'Alert'

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}
AlertDescription.displayName = 'AlertDescription'
