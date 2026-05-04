export function trendingScore(votes: number, createdAt: Date): number {
  const ageHours = (Date.now() - createdAt.getTime()) / 3_600_000
  return (votes - 1) / Math.pow(ageHours + 2, 1.8)
}
