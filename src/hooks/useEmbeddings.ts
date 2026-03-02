import { useState, useEffect, useRef, useCallback } from 'react'
import type { EmbeddingData } from '../types/vectors.ts'

export function useEmbeddings() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dataRef = useRef<EmbeddingData | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (dataRef.current) {
        setReady(true)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/data/embeddings.json')
        if (!response.ok) throw new Error('Kunde inte ladda ordvektorer')

        const data = (await response.json()) as EmbeddingData
        if (!cancelled) {
          dataRef.current = data
          setReady(true)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Fel vid laddning av data',
          )
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const getVector = useCallback(
    (word: string): number[] | null => {
      const entry = dataRef.current?.words[word.toLowerCase()]
      return entry?.v ?? null
    },
    [ready],
  )

  const getPosition = useCallback(
    (word: string): [number, number] | null => {
      const entry = dataRef.current?.words[word.toLowerCase()]
      return entry?.p ?? null
    },
    [ready],
  )

  const hasWord = useCallback(
    (word: string): boolean => {
      return word.toLowerCase() in (dataRef.current?.words ?? {})
    },
    [ready],
  )

  return {
    data: dataRef.current,
    isLoading,
    error,
    ready,
    getVector,
    getPosition,
    hasWord,
  }
}
