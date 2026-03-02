/**
 * Maps a probability (0-1) to a color for token visualization.
 * Red = low confidence, Green = high confidence.
 */
export function getProbabilityColor(probability: number): string {
  if (probability < 0.2) {
    return `rgba(220, 38, 38, ${0.6 + probability})`
  }
  if (probability < 0.4) {
    return `rgba(234, 88, 12, ${0.5 + probability})`
  }
  if (probability < 0.6) {
    return `rgba(245, 158, 11, ${0.5 + probability * 0.5})`
  }
  if (probability < 0.8) {
    return `rgba(132, 204, 22, ${0.5 + probability * 0.4})`
  }
  return `rgba(34, 197, 94, ${0.6 + probability * 0.3})`
}

export function getProbabilityBorder(
  probability: number,
  hasStrongAlternatives: boolean,
): string {
  if (hasStrongAlternatives) return '2px dashed #dc2626'
  if (probability < 0.3) return '2px solid #dc2626'
  if (probability < 0.5) return '1px solid #f59e0b'
  return 'none'
}

export function getProbabilityFontWeight(probability: number): number {
  if (probability < 0.3) return 300
  if (probability < 0.6) return 400
  return 600
}
