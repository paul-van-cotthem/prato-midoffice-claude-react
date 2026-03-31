import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  className?: string
}

export function DeleteButton({ className }: Props) {
  const { t } = useTranslation()
  return (
    <Button
      type="button"
      variant="outline"
      disabled
      className={cn(
        'cursor-not-allowed opacity-50 text-destructive border-destructive/30',
        className,
      )}
      aria-label={t('common.verwijderen')}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {t('common.verwijderen')}
    </Button>
  )
}
