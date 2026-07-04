import { songRepository } from '../../../storage/repositories/songRepository'
import type { Song } from '../../../shared/models/song'

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/

const validateYouTubeUrl = (url: string): boolean => {
  if (!url) return true
  return YOUTUBE_REGEX.test(url)
}

export const songService = {
  async getAll(): Promise<Song[]> {
    return songRepository.getAll()
  },

  async getById(id: string): Promise<Song | null> {
    return songRepository.getById(id)
  },

  async create(data: Omit<Song, 'userId' | 'createdAt' | 'updatedAt'>): Promise<Song> {
    if (!data.name.trim()) throw new Error('Nome da música é obrigatório')
    if (!data.artist.trim()) throw new Error('Nome do artista é obrigatório')
    if (!validateYouTubeUrl(data.youtubeOriginalUrl)) throw new Error('URL do YouTube inválida para original')
    if (!validateYouTubeUrl(data.youtubeLessonUrl)) throw new Error('URL do YouTube inválida para aula')
    if (!validateYouTubeUrl(data.youtubeBackingTrackUrl)) throw new Error('URL do YouTube inválida para backing track')
    if (!validateYouTubeUrl(data.youtubeImprovisationTrackUrl)) throw new Error('URL do YouTube inválida para improviso')
    return songRepository.create(data)
  },

  async update(id: string, data: Partial<Song>): Promise<void> {
    if (data.name !== undefined && !data.name.trim()) throw new Error('Nome da música não pode estar vazio')
    return songRepository.update(id, data)
  },

  async delete(id: string): Promise<void> {
    return songRepository.delete(id)
  },
}
