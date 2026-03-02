import { dotProduct } from './vectorMath.ts'

/**
 * Project a high-dimensional vector to 2D using stored PCA components.
 * Used for projecting the result of vector arithmetic into the same
 * 2D space as the pre-computed word positions.
 */
export function projectToPCA(
  vec: number[],
  components: [number[], number[]],
  mean: number[],
): [number, number] {
  // Center the vector by subtracting the mean
  const centered = vec.map((v, i) => v - mean[i])
  // Project onto each principal component
  const x = dotProduct(centered, components[0])
  const y = dotProduct(centered, components[1])
  return [x, y]
}
