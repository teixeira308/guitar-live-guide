import { useState } from 'react'
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonItem,
  IonList,
  IonSpinner,
} from '@ionic/react'
import { authService } from '../services/authService'

export const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.login(email, password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha na autenticação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 400, margin: '0 auto', minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/logo-e-nome.png"
              alt="Perfos"
              style={{ maxWidth: '100%', height: 'auto', display: 'inline-block' }}
            />
            <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}>
              Sua <span style={{ color: 'var(--ion-color-primary, #f9c41b)' }}>performance</span>. Organizada.
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <IonList inset>
              <IonItem>
                <IonInput
                  label="E-mail"
                  labelPlacement="floating"
                  type="email"
                  value={email}
                  onIonInput={(e) => setEmail(String(e.detail.value))}
                  required
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label="Senha"
                  labelPlacement="floating"
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
              <IonButton type="submit" expand="block" size="large" color="primary" disabled={loading}>
                {loading ? <IonSpinner /> : 'Entrar'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  )
}
