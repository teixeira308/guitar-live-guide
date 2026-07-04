import { playlistRepository } from '../../../storage/repositories/playlistRepository'
import { playlistSongRepository } from '../../../storage/repositories/playlistSongRepository'
import type { Playlist } from '../../../shared/models/playlist'
import type { PlaylistSong } from '../../../shared/models/playlistSong'

export const playlistService = {
  async getAll(): Promise<Playlist[]> {
    return playlistRepository.getAll()
  },

  async create(name: string): Promise<Playlist> {
    if (!name.trim()) throw new Error('Playlist name is required')
    return playlistRepository.create({
      id: crypto.randomUUID(),
      name: name.trim(),
      songCount: 0,
    })
  },

  async delete(id: string): Promise<void> {
    await playlistRepository.delete(id)
  },

  async getSongs(playlistId: string): Promise<PlaylistSong[]> {
    return playlistSongRepository.getByPlaylist(playlistId)
  },

  async addSong(playlistId: string, songId: string, sortOrder: number): Promise<PlaylistSong> {
    const playlist = await playlistRepository.getById(playlistId)
    if (playlist) {
      await playlistRepository.update(playlistId, { songCount: (playlist.songCount || 0) + 1 })
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
    const playlist = await playlistRepository.getById(playlistId)
    if (playlist) {
      await playlistRepository.update(playlistId, { songCount: Math.max(0, (playlist.songCount || 0) - 1) })
    }
    await playlistSongRepository.delete(id)
  },

  async reorderSongs(items: { id: string; sortOrder: number }[]): Promise<void> {
    await playlistSongRepository.reorder(items)
  },
}
