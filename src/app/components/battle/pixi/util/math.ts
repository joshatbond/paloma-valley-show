export const Ease = {
  inOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (t - 1) * (t - 1)),
  traingle: (t: number) => {
    t = t - Math.floor(t)
    return t < 0.5 ? 2 * t : 2 - 2 * t
  },
}
export function lerp(t: number) {
  return (a: number, b: number) => a * (1 - t) + b * t
}
