/**
 * Apply softmax with temperature scaling to an array of logprobs.
 * Lower temperature = sharper distribution (more confident).
 * Higher temperature = flatter distribution (more random).
 */
export function applySoftmax(
  logprobs: number[],
  temperature: number,
): number[] {
  const t = Math.max(temperature, 0.01) // avoid division by zero
  const scaled = logprobs.map((lp) => lp / t)
  const maxScaled = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - maxScaled))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}
