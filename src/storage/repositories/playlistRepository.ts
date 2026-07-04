import { where } from 'firebase/firestore'
import {
  createDocument,
  deleteDocument,
  getDocument,
  getUserId,
  queryDocuments,
  updateDocument,
} from './baseRepository'
import type { Playlist } from '../../shared/models/playlist'

const COLLECTION = 'playlists'

export const playlistRepository = {
  async getAll(): Promise<Playlist[]> {
    const userId = getUserId()
    const results = await queryDocuments<Playlist>(
      COLLECTION,
      where('userId', '==', userId)
    )
    return results.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
  },

  async getById(id: string): Promise<Playlist | null> {
    return getDocument<Playlist>(COLLECTION, id)
  },

  async create(data: Omit<Playlist, 'userId' | 'createdAt' | 'updatedAt'>): Promise<Playlist> {
    const userId = getUserId()
    return createDocument<Playlist>(COLLECTION, { ...data, userId } as Playlist)
  },

  async update(id: string, data: Partial<Playlist>): Promise<void> {
    await updateDocument(COLLECTION, id, data as Record<string, unknown>)
  },

  async delete(id: string): Promise<void> {
    await deleteDocument(COLLECTION, id)
  },
}
