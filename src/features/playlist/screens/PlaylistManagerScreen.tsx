import { useEffect, useMemo, useState } from 'react'
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonSearchbar,
  useIonAlert,
} from '@ionic/react'
import { add, create, trash, play } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchPlaylists, deletePlaylistThunk } from '../store/playlistSlice'
import { fetchGenres } from '../../genres/store/genreSlice'
import { formatDuration } from '../../../shared/utils/formatDuration'
import { LiveSessionScreen } from '../../session/screens/LiveSessionScreen'
import { PLAYLIST_TYPE_LABELS } from '../../../shared/models/playlist'
import type { PlaylistType } from '../../../shared/models/playlist'

interface Props {
  onBack: () => void
  onEditPlaylist: (playlistId: string) => void
  onEditPlaylistMetadata: (playlistId: string) => void
  onAddPlaylist: () => void
}

const typeBadgeColor = (type: PlaylistType) => {
  switch (type) {
    case 'setlist': return 'tertiary'
    case 'rehearsal': return 'secondary'
    case 'study': return 'warning'
    case 'warmup': return 'danger'
    default: return 'primary'
  }
}

export const PlaylistManagerScreen = ({ onEditPlaylist, onAddPlaylist, onEditPlaylistMetadata }: Props) => {
  const dispatch = useAppDispatch()
  const [presentAlert] = useIonAlert()
  const { items, loading, error } = useAppSelector((s) => s.playlists)
  const { items: genres } = useAppSelector((s) => s.genres)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items
    const lower = searchQuery.toLowerCase()
    return items.filter((p) => p.name.toLowerCase().includes(lower))
  }, [items, searchQuery])

  useEffect(() => {
    dispatch(fetchPlaylists())
    dispatch(fetchGenres())
  }, [dispatch])

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

        {loading && items.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <IonSpinner />
          </div>
        ) : error ? (
          <IonText color="danger">
            <p style={{ textAlign: 'center', padding: '2rem' }}>Erro: {error}</p>
          </IonText>
        ) : items.length === 0 ? (
          <IonText color="medium">
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              Nenhuma playlist ainda. Crie uma para começar.
            </p>
          </IonText>
        ) : (
          <>
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => setSearchQuery(String(e.detail.value))}
              placeholder="Buscar playlist..."
              animated
            />
            {filteredItems.length === 0 ? (
              <IonText color="medium">
                <p style={{ textAlign: 'center', padding: '2rem' }}>
                  Nenhuma playlist encontrada.
                </p>
              </IonText>
            ) : (
            <IonList inset>
            {filteredItems.map((p) => (
              <IonItemSliding key={p.id}>
                <IonItemOptions side="end">
                  <IonItemOption
                    color="danger"
                    onClick={() => {
                      presentAlert({
                        header: 'Excluir playlist',
                        message: `Tem certeza que deseja excluir "${p.name}"?`,
                        buttons: [
                          { text: 'Cancelar', role: 'cancel' },
                          {
                            text: 'Excluir',
                            role: 'destructive',
                            handler: () => dispatch(deletePlaylistThunk(p.id)),
                          },
                        ],
                      })
                    }}
                    aria-label={`Delete ${p.name}`}
                  >
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
                <IonItem button onClick={() => onEditPlaylist(p.id)}>
                  <IonLabel>
                    <h2>{p.name}</h2>
                    <p>
                      <IonBadge color={typeBadgeColor(p.type)} style={{ marginRight: 4 }}>
                        {PLAYLIST_TYPE_LABELS[p.type]}
                      </IonBadge>
                      {p.songCount} músicas · {formatDuration(p.estimatedDuration)}
                    </p>
                    {p.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)' }}>{p.description}</p>
                    )}
                    {p.genreId && (
                      <p style={{ fontSize: '0.75rem' }}>
                        {genres.find((g) => g.id === p.genreId)?.name || '—'}
                      </p>
                    )}
                    <p style={{ fontSize: '0.7rem', color: 'var(--ion-color-medium-tint)' }}>
                      {p.timesPlayed > 0 && `${p.timesPlayed}x tocada`}
                      {p.lastPerformedAt && ` · última: ${new Date(p.lastPerformedAt).toLocaleDateString()}`}
                    </p>
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
                  <IonButton
                    slot="end"
                    fill="clear"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditPlaylistMetadata(p.id)
                    }}
                    aria-label={`Editar ${p.name}`}
                  >
                    <IonIcon slot="icon-only" icon={create} color="medium" />
                  </IonButton>
                </IonItem>
              </IonItemSliding>
            ))}
          </IonList>
            )}
          </>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ bottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 16px)' }}>
          <IonFabButton onClick={onAddPlaylist} aria-label="Criar nova playlist">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}
