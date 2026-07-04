import {
  type User,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from 'firebase/auth'
import { auth } from '../../../shared/services/firebase'

export const authService = {
  login(email: string, password: string) {
    console.log('[AuthService] Signing in...')
    return signInWithEmailAndPassword(auth, email, password)
  },

  register(email: string, password: string) {
    console.log('[AuthService] Registering...')
    return createUserWithEmailAndPassword(auth, email, password)
  },

  logout() {
    console.log('[AuthService] Signing out...')
    return signOut(auth)
  },

  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  },

  updatePassword(newPassword: string) {
    const user = auth.currentUser
    if (!user) throw new Error('No authenticated user')
    return updatePassword(user, newPassword)
  },

  updateEmail(newEmail: string) {
    const user = auth.currentUser
    if (!user) throw new Error('No authenticated user')
    return updateEmail(user, newEmail)
  },

  reauthenticate(credential: ReturnType<typeof reauthenticateWithCredential>) {
    return credential
  },

  deleteAccount() {
    const user = auth.currentUser
    if (!user) throw new Error('No authenticated user')
    return deleteUser(user)
  },

  sendVerification() {
    const user = auth.currentUser
    if (!user) throw new Error('No authenticated user')
    return sendEmailVerification(user)
  },
}
