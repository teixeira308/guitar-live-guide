import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonIcon,
} from '@ionic/react'
import { play, library, list } from 'ionicons/icons'

interface DashboardScreenProps {
  onStartSession: () => void
  onManagePlaylists?: () => void
  onSongLibrary?: () => void
}

export const DashboardScreen = ({ onStartSession, onManagePlaylists, onSongLibrary }: DashboardScreenProps) => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80%', textAlign: 'center', gap: '1rem' }}>
          <img src="/logo-e-nome.png" alt="Perfos" style={{ width: 500, marginBottom: '0.5rem', borderRadius: 12 }} />

          <IonText color="medium">
            <p>Bem-vindo ao Perfos</p>
          </IonText>

          <IonText color="medium">
            <p style={{ maxWidth: 320, fontSize: '0.875rem' }}>
              Crie seu repertório, inicie uma sessão ao vivo e navegue pelas
              suas músicas com vídeos do YouTube.
            </p>
          </IonText>

          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <IonButton expand="block" size="large" onClick={onStartSession}>
              <IonIcon slot="start" icon={play} />
              Iniciar Sessão
            </IonButton>
            {onSongLibrary && (
              <IonButton expand="block" size="large" fill="outline" onClick={onSongLibrary}>
                <IonIcon slot="start" icon={library} />
                Biblioteca de Músicas
              </IonButton>
            )}
            {onManagePlaylists && (
              <IonButton expand="block" size="large" fill="outline" onClick={onManagePlaylists}>
                <IonIcon slot="start" icon={list} />
                Gerenciar Playlists
              </IonButton>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
