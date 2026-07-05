import { genreRepository } from '../../../storage/repositories/genreRepository'
import { SEED_GENRES } from '../../../shared/data/seed'
import type { Genre } from '../../../shared/models/genre'

export const genreService = {
  async getAll(): Promise<Genre[]> {
    const genres = await genreRepository.getAll()
    if (genres.length === 0) {
      for (const g of SEED_GENRES) {
        await genreRepository.create(g)
      }
      return SEED_GENRES
    }
    return genres
  },

  async create(data: { name: string }): Promise<Genre> {
    const id = `genre-${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    const nextOrder = (await genreRepository.getAll()).length + 1
    const genre: Genre = { id, name: data.name.trim(), displayOrder: nextOrder }
    await genreRepository.create(genre)
    return genre
  },
}
