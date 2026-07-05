export const formatDuration = (seconds: number): string => {
  if (seconds <= 0) return '0 min'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
  }
  return `${minutes} min`
}
