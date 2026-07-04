import { where } from 'firebase/firestore'
import { writeBatch } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { db } from '../../shared/services/firebase'
import {
  createDocument,
  deleteDocument,
  getUserId,
  queryDocuments,
} from './baseRepository'
import type { PlaylistSong } from '../../shared/models/playlistSong'

const COLLECTION = 'playlistSongs'

export const playlistSongRepository = {
  async getByPlaylist(playlistId: string): Promise<PlaylistSong[]> {
    const userId = getUserId()
    return queryDocuments<PlaylistSong>(
      COLLECTION,
      where('userId', '==', userId),
      where('playlistId', '==', playlistId)
    )
  },

  async create(data: Omit<PlaylistSong, 'createdAt'>): Promise<PlaylistSong> {
    const userId = getUserId()
    return createDocument<PlaylistSong>(COLLECTION, { ...data, userId } as PlaylistSong)
  },

  async delete(id: string): Promise<void> {
    await deleteDocument(COLLECTION, id)
  },

  async reorder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const batch = writeBatch(db)
    items.forEach((item) => {
      batch.update(doc(db, COLLECTION, item.id), { sortOrder: item.sortOrder })
    })
    await batch.commit()
  },
}
