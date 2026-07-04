import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../shared/services/firebase'
import type { Sentiment } from '../../shared/models/sentiment'

const COLLECTION = 'sentiments'

export const sentimentRepository = {
  async getAll(): Promise<Sentiment[]> {
    const q = collection(db, COLLECTION)
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as Sentiment)
  },
}
