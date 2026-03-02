import { useState, useCallback } from 'react'
import { useEmbeddings } from '../../hooks/useEmbeddings.ts'
import { useVectorSearch } from '../../hooks/useVectorSearch.ts'
import type { AnalogyResult } from '../../types/vectors.ts'
import { VectorInput } from './VectorInput.tsx'
import { PresetBar } from './PresetBar.tsx'
import { VectorChart } from './VectorChart.tsx'
import { ResultPanel } from './ResultPanel.tsx'
import { NearestNeighbors } from './NearestNeighbors.tsx'
import { DimensionalityNote } from './DimensionalityNote.tsx'
import { LoadingSpinner } from '../shared/LoadingSpinner.tsx'
import { ErrorMessage } from '../shared/ErrorMessage.tsx'

export function VectorPage() {
  const { data, isLoading: embeddingsLoading, error: embeddingsError, hasWord, ready } =
    useEmbeddings()
  const { solve } = useVectorSearch(data)

  const [startWord, setStartWord] = useState('king')
  const [subtractWord, setSubtractWord] = useState('man')
  const [addWord, setAddWord] = useState('woman')
  const [result, setResult] = useState<AnalogyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [computing, setComputing] = useState(false)

  const handleCalculate = useCallback(() => {
    if (!startWord.trim() || !subtractWord.trim() || !addWord.trim()) return

    setComputing(true)
    setError(null)

    // Use setTimeout to let the UI update with loading state
    setTimeout(() => {
      const result = solve(startWord, subtractWord, addWord)
      if ('error' in result) {
        setError(result.error)
        setResult(null)
      } else {
        setResult(result)
      }
      setComputing(false)
    }, 50)
  }, [startWord, subtractWord, addWord, solve])

  const handlePreset = useCallback(
    (start: string, subtract: string, add: string) => {
      setStartWord(start)
      setSubtractWord(subtract)
      setAddWord(add)
    },
    [],
  )

  if (embeddingsLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-16 text-center">
        <LoadingSpinner text="Laddar ordvektorer..." />
      </div>
    )
  }

  if (embeddingsError) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <ErrorMessage message={embeddingsError} />
        <p className="text-sm text-gray-500 mt-4">
          Kör <code className="bg-gray-100 px-1 rounded">python scripts/prepare-embeddings.py</code> för
          att generera ordvektorer.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      <h2 className="text-2xl font-serif font-bold text-uu-dark mb-2">
        Word2Vec Algebra
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Utforska hur ord representeras som vektorer och gör beräkningar med
        ordvektorer. Skriv in tre ord för att lösa en analogi.
      </p>

      <PresetBar onSelect={handlePreset} />

      <VectorInput
        startWord={startWord}
        subtractWord={subtractWord}
        addWord={addWord}
        onStartChange={setStartWord}
        onSubtractChange={setSubtractWord}
        onAddChange={setAddWord}
        onSubmit={handleCalculate}
        isLoading={computing}
        hasWord={hasWord}
        ready={ready}
      />

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VectorChart
            points={result?.points ?? []}
            isLoading={computing}
            startWord={startWord}
            subtractWord={subtractWord}
            addWord={addWord}
            resultWord={result?.resultWord ?? ''}
          />
        </div>

        <div className="flex flex-col gap-4">
          {result && (
            <>
              <ResultPanel
                startWord={startWord}
                subtractWord={subtractWord}
                addWord={addWord}
                resultWord={result.resultWord}
                similarity={result.similarity}
              />
              <NearestNeighbors
                neighbors={result.neighbors}
                resultWord={result.resultWord}
              />
            </>
          )}

          {data && (
            <DimensionalityNote
              dimensions={data.meta.dimensions}
              wordCount={data.meta.wordCount}
            />
          )}
        </div>
      </div>
    </div>
  )
}
