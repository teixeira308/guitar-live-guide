import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonIcon } from '@ionic/react'
import { time, playCircle, speedometer } from 'ionicons/icons'

interface SessionStatsPanelProps {
  elapsedSeconds: number
  songsPlayed: number
  averageTimePerSong: number
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const SessionStatsPanel = ({
  elapsedSeconds,
  songsPlayed,
  averageTimePerSong,
}: SessionStatsPanelProps) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Estatísticas da Sessão</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IonIcon icon={time} color="medium" />
            <IonText color="medium">
              <span>Tempo: <strong>{formatTime(elapsedSeconds)}</strong></span>
            </IonText>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IonIcon icon={playCircle} color="medium" />
            <IonText color="medium">
              <span>Tocadas: <strong>{songsPlayed}</strong></span>
            </IonText>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IonIcon icon={speedometer} color="medium" />
            <IonText color="medium">
              <span>Média: <strong>{formatTime(averageTimePerSong)}</strong></span>
            </IonText>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  )
}
