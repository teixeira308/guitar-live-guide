export type SongStatus = 'pending' | 'playing' | 'played'

export interface SessionSong {
  id: string
  sessionId: string
  songId: string
  status: SongStatus
  playedAt?: string
  durationSeconds?: number
  createdAt: string
}
