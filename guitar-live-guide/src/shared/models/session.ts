export type SessionStatus = 'active' | 'paused' | 'completed'

export interface Session {
  id: string
  userId: string
  workspaceId?: string
  playlistId?: string
  status: SessionStatus
  startedAt: string
  pausedAt?: string
  resumedAt?: string
  endedAt?: string
  elapsedSeconds: number
  songsPlayed: number
  averageTimePerSong: number
  estimatedRemainingMinutes: number
  createdAt: string
  updatedAt: string
}
