import { collection, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../shared/services/firebase'
import type { Genre } from '../../shared/models/genre'

const COLLECTION = 'genres'

export const genreRepository = {
  async getAll(): Promise<Genre[]> {
    const q = collection(db, COLLECTION)
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as Genre)
  },
}
