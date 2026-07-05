import { useEffect, useMemo, useState } from 'react'
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonText,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonSegment,
  IonSegmentButton,
  IonItemDivider,
  useIonAlert,
} from '@ionic/react'
import { add, create, trash, musicalNotes, sparkles, flame, people, musicalNote } from 'ionicons/icons'
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
  const [presentAlert] = useIonAlert()
  const { items, loading, error } = useAppSelector((s) => s.songs)
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null)
  const [typeFilter, setTypeFilter] = useState<'all' | 'repertoire' | 'improv'>('all')
  const [groupBy, setGroupBy] = useState<'none' | 'artist' | 'difficulty' | 'key'>('none')

  useEffect(() => {
    dispatch(fetchSongs())
  }, [dispatch])

  const confirmDelete = (id: string, name: string) => {
    presentAlert({
      header: 'Excluir música',
      message: `Excluir "${name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => dispatch(deleteSong(id)),
        },
      ],
    })
  }

  const handleRefresh = async (e: CustomEvent) => {
    await dispatch(fetchSongs())
    e.detail.complete()
  }

  const difficultyLabels: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    expert: 'Expert',
  }

  const displayItems = useMemo(() => {
    let result = filteredIds
      ? items.filter((s) => filteredIds.includes(s.id))
      : items
    if (typeFilter !== 'all') {
      result = result.filter((s) => s.type === typeFilter)
    }
    return result
  }, [items, filteredIds, typeFilter])

  const groupedSongs = useMemo(() => {
    if (groupBy === 'none') return null
    const groups = new Map<string, typeof displayItems>()
    for (const song of displayItems) {
      const val = (() => {
        switch (groupBy) {
          case 'artist': return song.artist?.trim() || 'Desconhecido'
          case 'difficulty': return difficultyLabels[song.difficulty || ''] || 'Desconhecido'
          case 'key': return song.key?.trim() || 'Desconhecido'
          default: return 'Outros'
        }
      })()
      if (!groups.has(val)) groups.set(val, [])
      groups.get(val)!.push(song)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
  }, [displayItems, groupBy])

  return (
    <IonPage>
      <IonContent>
        <style>{`
          .search-section {
            padding: 12px 16px 4px;
          }
          .segment-section {
            padding: 4px 16px 12px;
          }
        `}</style>

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
              Nenhuma música ainda. Adicione sua primeira música!
            </p>
          </IonText>
        ) : (
          <>
            <div className="search-section">
              <SongSearchBar onFilter={(ids) => setFilteredIds(ids.length === items.length ? null : ids)} />
            </div>
            <div className="segment-section" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <IonSegment value={typeFilter} onIonChange={(e) => { setTypeFilter(e.detail.value as 'all' | 'repertoire' | 'improv'); setGroupBy('none') }}>
                <IonSegmentButton value="all">
                  <IonLabel>Todas</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="repertoire">
                  <IonIcon icon={musicalNotes} />
                  <IonLabel>Repertório</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="improv">
                  <IonIcon icon={sparkles} />
                  <IonLabel>Improviso</IonLabel>
                </IonSegmentButton>
              </IonSegment>
              {typeFilter === 'repertoire' && (
              <IonSegment value={groupBy} onIonChange={(e) => setGroupBy(e.detail.value as any)}>
                <IonSegmentButton value="none">
                  <IonLabel>Ordem</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="artist">
                  <IonIcon icon={people} />
                  <IonLabel>Artista</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="difficulty">
                  <IonIcon icon={flame} />
                  <IonLabel>Nível</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="key">
                  <IonIcon icon={musicalNote} />
                  <IonLabel>Tom</IonLabel>
                </IonSegmentButton>
              </IonSegment>
              )}
            </div>
            {displayItems.length === 0 ? (
              <IonText color="medium">
                <p style={{ textAlign: 'center', padding: '2rem' }}>
                  {filteredIds
                    ? 'Nenhuma música corresponde à sua busca.'
                    : `Nenhuma música de ${typeFilter === 'improv' ? 'improviso' : 'repertório'} ainda.`}
                </p>
              </IonText>
            ) : (
            <div style={{ padding: '0 4px 80px' }}>
              {groupedSongs ? (
                groupedSongs.map(([groupName, songs]) => (
                  <div key={groupName} style={{ marginBottom: 12 }}>
                    <IonItemDivider style={{ background: 'transparent', minHeight: 32, paddingLeft: 16 }}>
                      <IonLabel style={{ fontWeight: 600, color: 'var(--ion-color-primary, #f9c41b)' }}>{groupName}</IonLabel>
                      <IonLabel slot="end" style={{ color: 'var(--ion-color-medium)' }}>{songs.length} {songs.length === 1 ? 'música' : 'músicas'}</IonLabel>
                    </IonItemDivider>
                    {songs.map((song) => (
                      <IonItemSliding key={song.id}>
                        <IonItemOptions side="end">
                          <IonItemOption color="danger" onClick={() => confirmDelete(song.id, song.name)} aria-label={`Delete ${song.name}`}>
                            <IonIcon slot="icon-only" icon={trash} />
                          </IonItemOption>
                        </IonItemOptions>
                        <IonItem button onClick={() => onEditSong(song.id)}>
                          <IonLabel>
                            <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 2 }}>{song.name}</h2>
                            <p style={{ color: 'var(--ion-color-medium)', fontSize: '0.85rem' }}>
                              {song.type === 'improv' ? 'Improviso' : song.artist}
                            </p>
                          </IonLabel>
                          <IonIcon slot="end" icon={create} color="medium" style={{ fontSize: 20 }} />
                        </IonItem>
                      </IonItemSliding>
                    ))}
                  </div>
                ))
              ) : (
                displayItems.map((song) => (
                  <IonItemSliding key={song.id}>
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => confirmDelete(song.id, song.name)} aria-label={`Delete ${song.name}`}>
                        <IonIcon slot="icon-only" icon={trash} />
                      </IonItemOption>
                    </IonItemOptions>
                    <IonItem button onClick={() => onEditSong(song.id)}>
                      <IonLabel>
                        <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 2 }}>{song.name}</h2>
                        <p style={{ color: 'var(--ion-color-medium)', fontSize: '0.85rem' }}>
                          {song.type === 'improv' ? 'Improviso' : song.artist}
                        </p>
                      </IonLabel>
                      <IonIcon slot="end" icon={create} color="medium" style={{ fontSize: 20 }} />
                    </IonItem>
                  </IonItemSliding>
                ))
              )}
            </div>
            )}
          </>
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
