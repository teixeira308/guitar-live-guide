import { where } from 'firebase/firestore'
import {
  createDocument,
  deleteDocument,
  getDocument,
  getUserId,
  queryDocuments,
  updateDocument,
} from './baseRepository'
import type { Song } from '../../shared/models/song'

const COLLECTION = 'songs'

export const songRepository = {
  async getAll(): Promise<Song[]> {
    const userId = getUserId()
    const results = await queryDocuments<Song>(
      COLLECTION,
      where('userId', '==', userId)
    )
    return results.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
  },

  async getById(id: string): Promise<Song | null> {
    return getDocument<Song>(COLLECTION, id)
  },

  async create(data: Omit<Song, 'userId' | 'createdAt' | 'updatedAt'>): Promise<Song> {
    const userId = getUserId()
    return createDocument<Song>(COLLECTION, { ...data, userId } as Song)
  },

  async update(id: string, data: Partial<Song>): Promise<void> {
    await updateDocument(COLLECTION, id, data as Record<string, unknown>)
  },

  async delete(id: string): Promise<void> {
    await deleteDocument(COLLECTION, id)
  },
}
