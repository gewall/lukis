interface Props {
  message: string | null
}

export function Toast({ message }: Props) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg border border-line bg-raised px-4 py-2 text-sm text-fg shadow-panel">
      {message}
    </div>
  )
}
