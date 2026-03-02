interface NearestNeighborsProps {
  neighbors: Array<{ word: string; similarity: number }>
  resultWord: string
}

export function NearestNeighbors({ neighbors, resultWord }: NearestNeighborsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
        Närmaste grannar
      </div>
      <div className="space-y-2">
        {neighbors.map(({ word, similarity }, i) => (
          <div
            key={word}
            className={`flex items-center gap-2 ${
              word === resultWord ? 'font-semibold' : ''
            }`}
          >
            <span className="text-xs text-gray-400 w-4 text-right">
              {i + 1}.
            </span>
            <span className="text-sm text-uu-dark flex-1 font-mono">
              {word}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(0, similarity * 100)}%`,
                    backgroundColor:
                      word === resultWord ? '#c60c30' : '#9ca3af',
                  }}
                />
              </div>
              <span className="text-xs font-mono text-gray-500 w-12 text-right">
                {(similarity * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
