interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md'
}

export function LoadingSpinner({ text, size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClass} border-2 border-gray-300 border-t-uu-red rounded-full animate-spin`}
      />
      {text && <span className="text-sm text-gray-500">{text}</span>}
    </div>
  )
}
