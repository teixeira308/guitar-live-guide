import { IonModal, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react'
import { school, musicalNotes } from 'ionicons/icons'

export type SessionMode = 'lesson' | 'backingTrack'

interface Props {
  open: boolean
  onSelect: (mode: SessionMode) => void
  onClose: () => void
}

export const SessionModeDialog = ({ open, onSelect, onClose }: Props) => {
  return (
    <IonModal
      isOpen={open}
      onDidDismiss={onClose}
      breakpoints={[0.25]}
      initialBreakpoint={0.25}
    >
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Modo de Sessão</h2>
        <IonList inset>
          <IonItem button onClick={() => onSelect('lesson')}>
            <IonIcon slot="start" icon={school} />
            <IonLabel>
              <h2>Aula</h2>
              <p>Aprenda e pratique com vídeos de aula</p>
            </IonLabel>
          </IonItem>
          <IonItem button onClick={() => onSelect('backingTrack')}>
            <IonIcon slot="start" icon={musicalNotes} />
            <IonLabel>
              <h2>Backing Track</h2>
              <p>Toque junto com backing tracks</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </div>
    </IonModal>
  )
}
