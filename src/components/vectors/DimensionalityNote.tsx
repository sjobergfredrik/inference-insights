interface DimensionalityNoteProps {
  dimensions: number
  wordCount: number
}

export function DimensionalityNote({ dimensions, wordCount }: DimensionalityNoteProps) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
      Varje ord representeras som en vektor med{' '}
      <span className="font-semibold">{dimensions} dimensioner</span>.
      Visualiseringen projicerar dessa vektorer till 2D med{' '}
      <span className="font-semibold">PCA</span> (Principal Component Analysis).
      Ordlistan innehåller{' '}
      <span className="font-semibold">{wordCount.toLocaleString('sv-SE')}</span> ord
      från GloVe.
    </div>
  )
}
