import {
  type FirestoreError,
  type QueryConstraint,
  type Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from '../../shared/services/firebase'

export const getUserId = (): string => {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('User must be authenticated')
  return uid
}

export const createDocument = async <T extends { id: string }>(
  collectionName: string,
  data: T
): Promise<T> => {
  const now = new Date().toISOString()
  const docRef = doc(db, collectionName, data.id)
  await setDoc(docRef, { ...data, createdAt: now, updatedAt: now })
  return { ...data, createdAt: now, updatedAt: now }
}

export const getDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const docSnap = await getDoc(doc(db, collectionName, id))
  if (!docSnap.exists()) return null
  return docSnap.data() as T
}

export const queryDocuments = async <T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.data() as T)
}

export const updateDocument = async (
  collectionName: string,
  id: string,
  data: Partial<Record<string, unknown>>
): Promise<void> => {
  const now = new Date().toISOString()
  await updateDoc(doc(db, collectionName, id), { ...data, updatedAt: now })
}

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, id))
}

export const subscribeToQuery = <T>(
  collectionName: string,
  callback: (items: T[]) => void,
  ...constraints: QueryConstraint[]
): Unsubscribe => {
  const q = query(collection(db, collectionName), ...constraints)
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => d.data() as T))
    },
    (error: FirestoreError) => {
      console.error('Snapshot error:', error)
    }
  )
}
