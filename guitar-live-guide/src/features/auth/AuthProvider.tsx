import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonSpinner,
  IonIcon,
} from '@ionic/react'
import { alertCircle } from 'ionicons/icons'
import { authService } from './services/authService'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, error: null })

export const useAuth = () => useContext(AuthContext)

async function checkFirebaseConnectivity(): Promise<string | null> {
  try {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
    if (!apiKey) return 'VITE_FIREBASE_API_KEY is not set in .env'

    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"returnSecureToken":true}' }
    )
    if (resp.ok) return null
    if (resp.status === 400) {
      const data = await resp.json()
      if (data.error?.message === 'EMAIL_EXISTS' || data.error?.message === 'MISSING_EMAIL') {
        return null
      }
      return `Firebase returned: ${data.error?.message || resp.status}`
    }
    return `HTTP ${resp.status} — Firebase unreachable`
  } catch (err) {
    return `Network error: ${err instanceof Error ? err.message : 'unknown'}`
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const unsub = authService.onAuthChange((u) => {
      setUser(u)
      setLoading(false)
      setError(null)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    })

    timeoutRef.current = setTimeout(async () => {
      const connectivityError = await checkFirebaseConnectivity()
      if (connectivityError) {
        setError(connectivityError)
      } else {
        setError(
          'Firebase is reachable but Auth is not responding. ' +
          'Make sure "Authentication > Sign-in method > Email/Password" is ENABLED ' +
          'in your Firebase Console (https://console.firebase.google.com).'
        )
      }
      setLoading(false)
    }, 10000)

    return () => {
      unsub()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (error) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
            <IonIcon icon={alertCircle} color="danger" style={{ fontSize: 48, marginBottom: '1rem' }} />
            <IonText color="danger">
              <h2 style={{ fontWeight: 700 }}>Connection Error</h2>
            </IonText>
            <IonText color="medium">
              <p>{error}</p>
            </IonText>
            <IonText color="medium">
              <p style={{ fontSize: '0.8rem' }}>
                Open the <strong>Firebase Console</strong> and verify:
              </p>
            </IonText>
            <ul style={{ textAlign: 'left', color: 'var(--ion-color-medium)', fontSize: '0.8rem' }}>
              <li>Authentication is enabled (Email/Password sign-in)</li>
              <li>The API key is not restricted (or allows this app)</li>
              <li>Firebase project is not in a broken state</li>
            </ul>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <IonButton expand="block" onClick={() => window.location.reload()}>
                Retry
              </IonButton>
              <IonButton expand="block" fill="outline" onClick={() => {
                setError(null)
                setLoading(false)
                setUser(null)
              }}>
                Continue
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', gap: '1rem' }}>
            <IonSpinner style={{ width: 40, height: 40 }} />
          </div>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading: false, error: null }}>
      {children}
    </AuthContext.Provider>
  )
}
