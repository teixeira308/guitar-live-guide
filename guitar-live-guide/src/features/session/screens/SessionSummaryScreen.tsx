import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react'
import { home } from 'ionicons/icons'

export interface SongStat {
  name: string
  artist: string
  status: 'played' | 'playing' | 'pending'
  duration: number
}

interface Props {
  songs: SongStat[]
  totalSessionTime: number
  onBackToDashboard: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const SessionSummaryScreen = ({ songs, totalSessionTime, onBackToDashboard }: Props) => {
  const played = songs.filter((s) => s.status === 'played')
  const totalPlayed = played.length
  const avgTime = totalPlayed > 0 ? Math.round(totalSessionTime / totalPlayed) : 0

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Session Complete</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <IonText color="success">
            <h2 style={{ fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>
              Session Complete!
            </h2>
          </IonText>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <StatBox label="Total Time" value={formatTime(totalSessionTime)} />
            <StatBox label="Played" value={String(totalPlayed)} />
            <StatBox label="Remaining" value={String(songs.length - totalPlayed)} />
            <StatBox label="Avg / Song" value={formatTime(avgTime)} />
          </div>

          <IonText>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Songs</h3>
          </IonText>

          {songs.length === 0 ? (
            <IonText color="medium">
              <p style={{ textAlign: 'center', padding: '1rem' }}>No songs in this session.</p>
            </IonText>
          ) : (
            <IonList inset>
              {songs.map((song, i) => (
                <IonItem key={i}>
                  <IonLabel>
                    <h2>{song.name}</h2>
                    <p>{song.artist}</p>
                  </IonLabel>
                  <IonText
                    slot="end"
                    color={song.status === 'played' ? 'success' : 'medium'}
                    style={{ fontSize: '0.875rem' }}
                  >
                    {song.status === 'played'
                      ? formatTime(song.duration)
                      : song.status === 'playing'
                        ? 'In progress'
                        : 'Pending'}
                  </IonText>
                </IonItem>
              ))}
            </IonList>
          )}

          <div style={{ padding: '1rem 0' }}>
            <IonButton expand="block" size="large" onClick={onBackToDashboard}>
              <IonIcon slot="start" icon={home} />
              Back to Dashboard
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 70 }}>
      <IonText>
        <h3 style={{ fontWeight: 700, margin: 0 }}>{value}</h3>
      </IonText>
      <IonText color="medium">
        <p style={{ fontSize: '0.75rem', margin: 0 }}>{label}</p>
      </IonText>
    </div>
  )
}
