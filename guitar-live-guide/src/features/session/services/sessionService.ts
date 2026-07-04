import { sessionRepository } from '../../../storage/repositories/sessionRepository'
import { sessionSongRepository } from '../../../storage/repositories/sessionSongRepository'
import type { Session } from '../../../shared/models/session'
import type { SessionSong } from '../../../shared/models/sessionSong'

export const sessionService = {
  async start(playlistId?: string): Promise<Session> {
    const now = new Date().toISOString()
    return sessionRepository.create({
      id: crypto.randomUUID(),
      playlistId,
      status: 'active',
      startedAt: now,
      elapsedSeconds: 0,
      songsPlayed: 0,
      averageTimePerSong: 0,
      estimatedRemainingMinutes: 0,
    })
  },

  async resume(sessionId: string): Promise<Session | null> {
    return sessionRepository.getById(sessionId)
  },

  async getActive(): Promise<Session | null> {
    return sessionRepository.getActive()
  },

  async markPlaying(sessionId: string, songId: string): Promise<SessionSong> {
    const existing = await sessionSongRepository.getPlaying(sessionId)
    if (existing) {
      await sessionSongRepository.update(existing.id, { status: 'pending' })
    }
    return sessionSongRepository.create({
      id: `${sessionId}_${songId}`,
      sessionId,
      songId,
      status: 'playing',
    })
  },

  async markPlayed(sessionId: string, songId: string): Promise<void> {
    const id = `${sessionId}_${songId}`
    const now = new Date().toISOString()
    await sessionSongRepository.update(id, {
      status: 'played',
      playedAt: now,
    })
    const session = await sessionRepository.getById(sessionId)
    if (session) {
      const allSongs = await sessionSongRepository.getBySession(sessionId)
      const played = allSongs.filter((s) => s.status === 'played')
      await sessionRepository.update(sessionId, {
        songsPlayed: played.length,
      })
    }
  },

  async end(sessionId: string): Promise<void> {
    const now = new Date().toISOString()
    await sessionRepository.update(sessionId, {
      status: 'completed',
      endedAt: now,
    })
  },

  async getSessionSongs(sessionId: string): Promise<SessionSong[]> {
    return sessionSongRepository.getBySession(sessionId)
  },
}
