import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Copy, Download, X } from 'lucide-react'
import { toast } from 'sonner'
import type { BerichtLogEntry } from '@/lib/mock/berichten.mock'

interface Props {
  entry: BerichtLogEntry | null
  open: boolean
  onClose: () => void
}

export function BerichtPreview({ entry, open, onClose }: Props) {
  const { t } = useTranslation()

  const jsonString = entry ? JSON.stringify(entry.bericht, null, 2) : ''

  function handleCopy() {
    void navigator.clipboard.writeText(jsonString).then(() => {
      toast.success(t('bericht_preview.gekopieerd'))
    })
  }

  function handleDownload() {
    if (!entry) return
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${entry.type}-${entry.entiteitId}-${entry.timestamp.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const highlightedJson = jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"([^"]+)":/g, '<span style="color:#93c5fd">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span style="color:#86efac">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span style="color:#fcd34d">$1</span>')
    .replace(/: (true|false)/g, ': <span style="color:#f9a8d4">$1</span>')
    .replace(/: (null)/g, ': <span style="color:#94a3b8">$1</span>')

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
    >
      <SheetContent className="w-[600px] sm:w-[600px] sm:max-w-none overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('bericht_preview.titel')}</SheetTitle>
          {entry && (
            <SheetDescription>
              {entry.type} — {entry.entiteitNaam} —{' '}
              {new Date(entry.timestamp).toLocaleString('nl-BE')}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            {t('bericht_preview.kopieer')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            {t('common.laden')}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="ml-auto">
            <X className="h-4 w-4 mr-1" />
            {t('common.sluiten')}
          </Button>
        </div>

        <pre
          className="mt-4 rounded-md bg-slate-950 p-4 text-xs overflow-x-auto max-h-[calc(100vh-200px)] overflow-y-auto"
          style={{ color: '#e2e8f0' }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional JSON syntax highlighting
          dangerouslySetInnerHTML={{ __html: highlightedJson }}
        />
      </SheetContent>
    </Sheet>
  )
}
