interface Props {
  opmerkingen: string | null
}

export function OpmerkingPanel({ opmerkingen }: Props) {
  if (opmerkingen === null || opmerkingen.trim() === '') {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        <p className="font-medium">Geen opmerkingen</p>
        <p className="mt-1">Er zijn geen opmerkingen voor deze loonberekening.</p>
      </div>
    )
  }

  return (
    <blockquote className="rounded-md border-l-4 border-blue-400 bg-blue-50 px-4 py-3 text-sm text-gray-800">
      <p className="whitespace-pre-wrap">{opmerkingen}</p>
    </blockquote>
  )
}
