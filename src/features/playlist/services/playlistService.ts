import { playlistRepository } from '../../../storage/repositories/playlistRepository'
import { playlistSongRepository } from '../../../storage/repositories/playlistSongRepository'
import { songRepository } from '../../../storage/repositories/songRepository'
import type { Playlist, PlaylistType } from '../../../shared/models/playlist'
import type { PlaylistSong } from '../../../shared/models/playlistSong'

export const playlistService = {
  async getAll(): Promise<Playlist[]> {
    return playlistRepository.getAll()
  },

  async create(data: {
    name: string
    description?: string
    genreId?: string
    type: PlaylistType
  }): Promise<Playlist> {
    if (!data.name.trim()) throw new Error('Playlist name is required')
    const doc: Record<string, unknown> = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      type: data.type || 'repertoire',
      estimatedDuration: 0,
      timesPlayed: 0,
      songCount: 0,
    }
    if (data.description?.trim()) doc.description = data.description.trim()
    if (data.genreId) doc.genreId = data.genreId
    return playlistRepository.create(doc as Omit<Playlist, 'userId' | 'createdAt' | 'updatedAt'>)
  },

  async update(id: string, data: Partial<Playlist>): Promise<void> {
    const clean: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) clean[key] = value
    }
    await playlistRepository.update(id, clean as Partial<Playlist>)
  },

  async delete(id: string): Promise<void> {
    await playlistRepository.delete(id)
  },

  async getSongs(playlistId: string): Promise<PlaylistSong[]> {
    return playlistSongRepository.getByPlaylist(playlistId)
  },

  async addSong(playlistId: string, songId: string, sortOrder: number): Promise<PlaylistSong> {
    const playlist = await playlistRepository.getById(playlistId)
    const song = await songRepository.getById(songId)
    if (playlist) {
      const newDuration = (playlist.estimatedDuration || 0) + (song?.duration || 0)
      await playlistRepository.update(playlistId, {
        songCount: (playlist.songCount || 0) + 1,
        estimatedDuration: newDuration,
      })
    }
    return playlistSongRepository.create({
      id: `${playlistId}_${songId}`,
      playlistId,
      songId,
      sortOrder,
    })
  },

  async removeSong(id: string): Promise<void> {
    const playlistId = id.split('_')[0]
    const songId = id.split('_')[1]
    const playlist = await playlistRepository.getById(playlistId)
    const song = await songRepository.getById(songId)
    if (playlist) {
      const newDuration = Math.max(0, (playlist.estimatedDuration || 0) - (song?.duration || 0))
      await playlistRepository.update(playlistId, {
        songCount: Math.max(0, (playlist.songCount || 0) - 1),
        estimatedDuration: newDuration,
      })
    }
    await playlistSongRepository.delete(id)
  },

  async reorderSongs(items: { id: string; sortOrder: number }[]): Promise<void> {
    await playlistSongRepository.reorder(items)
  },

  async markAsPerformed(id: string): Promise<void> {
    const playlist = await playlistRepository.getById(id)
    if (playlist) {
      await playlistRepository.update(id, {
        lastPerformedAt: new Date().toISOString(),
        timesPlayed: (playlist.timesPlayed || 0) + 1,
      })
    }
  },
}
