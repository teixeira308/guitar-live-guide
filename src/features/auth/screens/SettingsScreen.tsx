import { useState } from 'react'
import { IonPage, IonContent, IonButton, IonText, IonIcon, IonSpinner } from '@ionic/react'
import { logOut } from 'ionicons/icons'
import { authService } from '../services/authService'

export const SettingsScreen = () => {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await authService.logout()
    } catch {
      console.error('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80%', textAlign: 'center', gap: '1rem' }}>
          <IonText color="medium">
            <h2>Ajustes</h2>
          </IonText>

          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <IonButton expand="block" size="large" color="danger" onClick={handleLogout} disabled={loading}>
              <IonIcon slot="start" icon={logOut} />
              {loading ? <IonSpinner /> : 'Sair'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
