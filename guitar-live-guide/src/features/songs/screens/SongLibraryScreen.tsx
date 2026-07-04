import { useEffect, useState } from 'react'
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonSpinner,
  IonText,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
} from '@ionic/react'
import { add, create, trash } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { deleteSong, fetchSongs } from '../store/songsSlice'
import { SongSearchBar } from './SongSearchBar'

interface Props {
  onBack: () => void
  onAddSong: () => void
  onEditSong: (songId: string) => void
}

export const SongLibraryScreen = ({ onAddSong, onEditSong }: Props) => {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.songs)
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null)

  useEffect(() => {
    dispatch(fetchSongs())
  }, [dispatch])

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Excluir "${name}"?`)) {
      dispatch(deleteSong(id))
    }
  }

  const handleRefresh = async (e: CustomEvent) => {
    await dispatch(fetchSongs())
    e.detail.complete()
  }

  const displayItems = filteredIds
    ? items.filter((s) => filteredIds.includes(s.id))
    : items

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ padding: '0.5rem' }}>
          <SongSearchBar onFilter={(ids) => setFilteredIds(ids.length === items.length ? null : ids)} />
        </div>

        {loading && items.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <IonSpinner />
          </div>
        ) : error ? (
          <IonText color="danger">
            <p style={{ textAlign: 'center', padding: '2rem' }}>Erro: {error}</p>
          </IonText>
        ) : displayItems.length === 0 ? (
          <IonText color="medium">
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              {filteredIds ? 'Nenhuma música corresponde à sua busca.' : 'Nenhuma música ainda. Adicione sua primeira música!'}
            </p>
          </IonText>
        ) : (
          <IonList inset>
            {displayItems.map((song) => (
              <IonItemSliding key={song.id}>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => handleDelete(song.id, song.name)} aria-label={`Delete ${song.name}`}>
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
                <IonItem button onClick={() => onEditSong(song.id)}>
                  <IonLabel>
                    <h2>{song.name}</h2>
                    <p>{song.artist}</p>
                  </IonLabel>
                  <IonIcon slot="end" icon={create} color="medium" />
                </IonItem>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ bottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 16px)' }}>
          <IonFabButton onClick={onAddSong} aria-label="Adicionar nova música">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}
