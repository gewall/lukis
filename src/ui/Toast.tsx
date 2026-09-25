interface Props {
  message: string | null
}

export function Toast({ message }: Props) {
  if (!message) return null
  return (
    <div className="fixed top-16 left-1/2 z-20 max-w-[calc(100vw-24px)] text-center md:top-auto md:bottom-20 -translate-x-1/2 rounded-lg border border-line bg-raised px-4 py-2 text-sm text-fg shadow-panel">
      {message}
    </div>
  )
}
