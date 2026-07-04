import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missingKeys.length > 0) {
  console.warn(
    `[Firebase] Missing env vars: ${missingKeys.join(', ')}. ` +
    'Create a .env file based on .env.example with your Firebase project config.'
  )
}

let app
try {
  app = initializeApp(firebaseConfig)
} catch (err) {
  console.error('[Firebase] Initialization failed:', err)
  throw err
}

export const db = getFirestore(app)
export const auth = getAuth(app)
export default app
