import { orderBy, where } from 'firebase/firestore'
import {
  createDocument,
  getDocument,
  getUserId,
  queryDocuments,
  updateDocument,
} from './baseRepository'
import type { Session } from '../../shared/models/session'

const COLLECTION = 'sessions'

export const sessionRepository = {
  async getActive(): Promise<Session | null> {
    const userId = getUserId()
    const sessions = await queryDocuments<Session>(
      COLLECTION,
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('startedAt', 'desc')
    )
    return sessions[0] || null
  },

  async getById(id: string): Promise<Session | null> {
    return getDocument<Session>(COLLECTION, id)
  },

  async create(data: Omit<Session, 'userId' | 'createdAt' | 'updatedAt'>): Promise<Session> {
    const userId = getUserId()
    return createDocument<Session>(COLLECTION, { ...data, userId } as Session)
  },

  async update(id: string, data: Partial<Session>): Promise<void> {
    await updateDocument(COLLECTION, id, data as Record<string, unknown>)
  },
}
