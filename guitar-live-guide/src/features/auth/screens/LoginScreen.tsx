import { useState } from 'react'
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonItem,
  IonList,
  IonLabel,
} from '@ionic/react'
import { authService } from '../services/authService'

export const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await authService.login(email, password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/logo-azul-com-frase.png"
              alt="Perfos"
              style={{ maxWidth: 260, marginBottom: '1rem' }}
            />
            <IonText color="primary">
              <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}>Sign In</h1>
            </IonText>
          </div>

          <form onSubmit={handleSubmit}>
            <IonList inset>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonInput={(e) => setEmail(String(e.detail.value))}
                  required
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(e) => setPassword(String(e.detail.value))}
                  required
                />
              </IonItem>
            </IonList>

            {error && (
              <IonText color="danger">
                <p style={{ padding: '0.5rem 1rem' }}>{error}</p>
              </IonText>
            )}

            <div style={{ padding: '1rem' }}>
              <IonButton type="submit" expand="block" size="large">
                Sign In
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  )
}
