export enum NodeType {
  START = 'START',
  SUBTRACT = 'SUBTRACT',
  ADD = 'ADD',
  RESULT = 'RESULT',
  CONTEXT = 'CONTEXT',
}

export interface WordPoint {
  word: string
  x: number
  y: number
  type: NodeType
  similarity?: number
}

export interface EmbeddingEntry {
  v: number[] // full-dimensional vector
  p: [number, number] // 2D PCA projection
}

export interface EmbeddingMeta {
  dimensions: number
  wordCount: number
  source: string
  pcaComponents: [number[], number[]]
  pcaMean: number[]
}

export interface EmbeddingData {
  meta: EmbeddingMeta
  words: Record<string, EmbeddingEntry>
}

export interface AnalogyResult {
  points: WordPoint[]
  resultWord: string
  similarity: number
  neighbors: Array<{ word: string; similarity: number }>
}
