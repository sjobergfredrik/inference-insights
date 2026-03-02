interface ResultPanelProps {
  startWord: string
  subtractWord: string
  addWord: string
  resultWord: string
  similarity: number
}

export function ResultPanel({
  startWord,
  subtractWord,
  addWord,
  resultWord,
  similarity,
}: ResultPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
        Resultat
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">
          {startWord} &minus; {subtractWord} + {addWord} =
        </div>
        <div className="text-3xl font-serif italic text-uu-dark border-l-4 border-uu-red pl-4">
          {resultWord}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <span className="font-medium">Kosinuslikhet:</span>{' '}
        <span className="font-mono">{(similarity * 100).toFixed(1)}%</span>
      </div>
    </div>
  )
}
