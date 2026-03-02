import { useCallback } from 'react'
import type { EmbeddingData, AnalogyResult, WordPoint } from '../types/vectors.ts'
import { NodeType } from '../types/vectors.ts'
import {
  solveAnalogy,
  findNearestNeighbors,
  cosineSimilarity,
} from '../lib/vectorMath.ts'
import { projectToPCA } from '../lib/pca.ts'

export function useVectorSearch(data: EmbeddingData | null) {
  const solve = useCallback(
    (
      startWord: string,
      subtractWord: string,
      addWord: string,
    ): AnalogyResult | { error: string } => {
      if (!data) return { error: 'Ordvektorer har inte laddats ännu' }

      const start = data.words[startWord.toLowerCase()]
      const subtract = data.words[subtractWord.toLowerCase()]
      const add = data.words[addWord.toLowerCase()]

      if (!start) return { error: `Ordet "${startWord}" finns inte i ordlistan` }
      if (!subtract)
        return { error: `Ordet "${subtractWord}" finns inte i ordlistan` }
      if (!add) return { error: `Ordet "${addWord}" finns inte i ordlistan` }

      // Compute result vector: start - subtract + add
      const resultVec = solveAnalogy(start.v, subtract.v, add.v)

      // Find nearest neighbors
      const inputWords = [
        startWord.toLowerCase(),
        subtractWord.toLowerCase(),
        addWord.toLowerCase(),
      ]
      const neighbors = findNearestNeighbors(resultVec, data.words, 10, inputWords)

      // The top neighbor is the result word
      const resultWord = neighbors[0]?.word ?? '?'
      const resultSimilarity = neighbors[0]?.similarity ?? 0

      // Project result vector to 2D
      const resultPos = projectToPCA(
        resultVec,
        data.meta.pcaComponents,
        data.meta.pcaMean,
      )

      // Build points for visualization
      const points: WordPoint[] = [
        {
          word: startWord,
          x: start.p[0],
          y: start.p[1],
          type: NodeType.START,
        },
        {
          word: subtractWord,
          x: subtract.p[0],
          y: subtract.p[1],
          type: NodeType.SUBTRACT,
        },
        {
          word: addWord,
          x: add.p[0],
          y: add.p[1],
          type: NodeType.ADD,
        },
        {
          word: resultWord,
          x: resultPos[0],
          y: resultPos[1],
          type: NodeType.RESULT,
          similarity: resultSimilarity,
        },
        // Add top 5 context neighbors (skip the first which is the result)
        ...neighbors.slice(1, 6).map((n) => ({
          word: n.word,
          x: data.words[n.word].p[0],
          y: data.words[n.word].p[1],
          type: NodeType.CONTEXT,
          similarity: n.similarity,
        })),
      ]

      return {
        points,
        resultWord,
        similarity: resultSimilarity,
        neighbors: neighbors.slice(0, 10),
      }
    },
    [data],
  )

  return { solve }
}
