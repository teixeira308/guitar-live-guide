import { where } from 'firebase/firestore'
import {
  createDocument,
  getUserId,
  queryDocuments,
  updateDocument,
} from './baseRepository'
import type { SessionSong } from '../../shared/models/sessionSong'

const COLLECTION = 'sessionSongs'

export const sessionSongRepository = {
  async getBySession(sessionId: string): Promise<SessionSong[]> {
    const userId = getUserId()
    return queryDocuments<SessionSong>(
      COLLECTION,
      where('userId', '==', userId),
      where('sessionId', '==', sessionId)
    )
  },

  async create(data: Omit<SessionSong, 'createdAt'>): Promise<SessionSong> {
    const userId = getUserId()
    return createDocument<SessionSong>(COLLECTION, { ...data, userId } as unknown as SessionSong)
  },

  async update(id: string, data: Partial<SessionSong>): Promise<void> {
    await updateDocument(COLLECTION, id, data as Record<string, unknown>)
  },

  async getPlaying(sessionId: string): Promise<SessionSong | null> {
    const userId = getUserId()
    const items = await queryDocuments<SessionSong>(
      COLLECTION,
      where('userId', '==', userId),
      where('sessionId', '==', sessionId),
      where('status', '==', 'playing')
    )
    return items[0] || null
  },
}
