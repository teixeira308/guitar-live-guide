import { useEffect } from 'react'
import {
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonSpinner,
} from '@ionic/react'
import { musicalNotes, list } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchPlaylists } from '../store/playlistSlice'
import { formatDuration } from '../../../shared/utils/formatDuration'

interface Props {
  open: boolean
  onSelect: (playlistId?: string) => void
  onClose: () => void
}

export const PlaylistPickerDialog = ({ open, onSelect, onClose }: Props) => {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.playlists)

  useEffect(() => {
    if (open) dispatch(fetchPlaylists())
  }, [dispatch, open])

  return (
    <IonModal
      isOpen={open}
      onDidDismiss={onClose}
      breakpoints={[0.25, 0.5, 0.75]}
      initialBreakpoint={0.5}
    >
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Selecionar uma Playlist</h2>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <IonSpinner />
          </div>
        ) : (
          <IonList inset>
            <IonItem button onClick={() => onSelect(undefined)}>
              <IonIcon slot="start" icon={musicalNotes} />
              <IonLabel>
                <h2>Todas as Músicas</h2>
                <p>Usar todas as músicas sem playlist</p>
              </IonLabel>
            </IonItem>
            {items.length === 0 && (
              <IonItem disabled>
                <IonLabel>
                  <p>Nenhuma playlist ainda</p>
                </IonLabel>
              </IonItem>
            )}
            {items.map((p) => (
              <IonItem key={p.id} button onClick={() => onSelect(p.id)}>
                <IonIcon slot="start" icon={list} />
                <IonLabel>
                  <h2>{p.name}</h2>
                  <p>{p.songCount} músicas · {formatDuration(p.estimatedDuration)}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </div>
    </IonModal>
  )
}
