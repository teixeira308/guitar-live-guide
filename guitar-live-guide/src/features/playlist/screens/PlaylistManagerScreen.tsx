import { useEffect, useState } from 'react'
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
  IonText,
  IonSpinner,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react'
import { add, create, trash, play } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchPlaylists, createPlaylistThunk, deletePlaylistThunk } from '../store/playlistSlice'
import { LiveSessionScreen } from '../../session/screens/LiveSessionScreen'

interface Props {
  onBack: () => void
  onEditPlaylist: (playlistId: string) => void
}

export const PlaylistManagerScreen = ({ onEditPlaylist }: Props) => {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.playlists)
  const [newName, setNewName] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchPlaylists())
  }, [dispatch])

  const handleCreate = () => {
    if (newName.trim()) {
      dispatch(createPlaylistThunk(newName.trim()))
      setNewName('')
    }
  }

  const handleRefresh = async (e: CustomEvent) => {
    await dispatch(fetchPlaylists())
    e.detail.complete()
  }

  if (selectedId) {
    return (
      <LiveSessionScreen
        playlistId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
          <IonInput
            value={newName}
            onIonInput={(e) => setNewName(String(e.detail.value))}
            placeholder="New playlist name"
            fill="outline"
            style={{ flex: 1 }}
          />
          <IonButton onClick={handleCreate} aria-label="Create playlist">
            <IonIcon slot="start" icon={add} />
            Create
          </IonButton>
        </div>

        {loading && items.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <IonSpinner />
          </div>
        ) : error ? (
          <IonText color="danger">
            <p style={{ textAlign: 'center', padding: '2rem' }}>Error: {error}</p>
          </IonText>
        ) : items.length === 0 ? (
          <IonText color="medium">
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              No playlists yet. Create one to start.
            </p>
          </IonText>
        ) : (
          <IonList inset>
            {items.map((p) => (
              <IonItemSliding key={p.id}>
                <IonItemOptions side="end">
                  <IonItemOption
                    color="danger"
                    onClick={() => dispatch(deletePlaylistThunk(p.id))}
                    aria-label={`Delete ${p.name}`}
                  >
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
                <IonItem button onClick={() => onEditPlaylist(p.id)}>
                  <IonLabel>
                    <h2>{p.name}</h2>
                    <p>{p.songCount} songs</p>
                  </IonLabel>
                  <IonButton
                    slot="end"
                    fill="clear"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedId(p.id)
                    }}
                    aria-label={`Play ${p.name}`}
                  >
                    <IonIcon slot="icon-only" icon={play} color="primary" />
                  </IonButton>
                  <IonIcon slot="end" icon={create} color="medium" />
                </IonItem>
              </IonItemSliding>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  )
}
