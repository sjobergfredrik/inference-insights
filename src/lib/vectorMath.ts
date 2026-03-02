export function vectorAdd(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + b[i])
}

export function vectorSubtract(a: number[], b: number[]): number[] {
  return a.map((v, i) => v - b[i])
}

export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0)
}

export function magnitude(v: number[]): number {
  return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0))
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = dotProduct(a, b)
  const magA = magnitude(a)
  const magB = magnitude(b)
  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}

export function solveAnalogy(
  startVec: number[],
  subtractVec: number[],
  addVec: number[],
): number[] {
  // result = start - subtract + add
  return vectorAdd(vectorSubtract(startVec, subtractVec), addVec)
}

export function findNearestNeighbors(
  target: number[],
  vocabulary: Record<string, { v: number[] }>,
  topN: number,
  exclude: string[] = [],
): Array<{ word: string; similarity: number }> {
  const excludeSet = new Set(exclude.map((w) => w.toLowerCase()))

  const scored = Object.entries(vocabulary)
    .filter(([word]) => !excludeSet.has(word.toLowerCase()))
    .map(([word, entry]) => ({
      word,
      similarity: cosineSimilarity(target, entry.v),
    }))

  scored.sort((a, b) => b.similarity - a.similarity)
  return scored.slice(0, topN)
}
