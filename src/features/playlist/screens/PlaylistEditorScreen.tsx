import { useEffect, useMemo, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonCheckbox,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonSegment,
  IonSegmentButton,
  IonItemDivider,
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonReorderGroup,
  IonReorder,
  useIonAlert,
} from '@ionic/react'
import { add, trash, flame, musicalNote, people } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchPlaylists } from '../store/playlistSlice'
import { fetchSongs } from '../../songs/store/songsSlice'
import { playlistService } from '../services/playlistService'
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery'
import type { Song } from '../../../shared/models/song'
import type { PlaylistSong } from '../../../shared/models/playlistSong'

interface Props {
  playlistId: string
  onBack: () => void
}

export const PlaylistEditorScreen = ({ playlistId, onBack }: Props) => {
  const dispatch = useAppDispatch()
  const [presentAlert] = useIonAlert()
  const { items: playlists } = useAppSelector((s) => s.playlists)
  const { items: allSongs } = useAppSelector((s) => s.songs)
  const [playlistSongs, setPlaylistSongs] = useState<(PlaylistSong & { song?: Song })[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [groupBy, setGroupBy] = useState<'none' | 'artist' | 'difficulty' | 'key'>('none')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchAddQuery, setSearchAddQuery] = useState('')
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const filteredPlaylistSongs = useMemo(() => {
    if (!searchQuery.trim()) return playlistSongs
    const lower = searchQuery.toLowerCase()
    return playlistSongs.filter(
      (ps) =>
        ps.song?.name?.toLowerCase().includes(lower) ||
        ps.song?.artist?.toLowerCase().includes(lower)
    )
  }, [playlistSongs, searchQuery])

  const difficultyLabels: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    expert: 'Expert',
  }

  const groupedSongs = useMemo(() => {
    if (groupBy === 'none') return null
    const groups = new Map<string, (PlaylistSong & { song?: Song })[]>()
    for (const ps of filteredPlaylistSongs) {
      const val = (() => {
        switch (groupBy) {
          case 'artist': return ps.song?.artist?.trim() || 'Desconhecido'
          case 'difficulty': return difficultyLabels[ps.song?.difficulty || ''] || 'Desconhecido'
          case 'key': return ps.song?.key?.trim() || 'Desconhecido'
          default: return 'Outros'
        }
      })()
      if (!groups.has(val)) groups.set(val, [])
      groups.get(val)!.push(ps)
    }
    const sorted = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
    return sorted
  }, [playlistSongs, groupBy])

  const playlist = playlists.find((p) => p.id === playlistId)

  const loadSongs = async () => {
    setLoading(true)
    const items = await playlistService.getSongs(playlistId)
    const enriched = items.map((ps) => ({
      ...ps,
      song: allSongs.find((s) => s.id === ps.songId),
    }))
    enriched.sort((a, b) => a.sortOrder - b.sortOrder)
    setPlaylistSongs(enriched)
    setLoading(false)
  }

  useEffect(() => {
    dispatch(fetchPlaylists())
    dispatch(fetchSongs())
  }, [dispatch])

  useEffect(() => {
    if (allSongs.length > 0) loadSongs()
  }, [allSongs, playlistId])

  const confirmRemove = (playlistSongId: string, songName: string) => {
    presentAlert({
      header: 'Remover música',
      message: `Remover "${songName}" da playlist?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          role: 'destructive',
          handler: async () => {
            await playlistService.removeSong(playlistSongId)
            dispatch(fetchPlaylists())
            loadSongs()
          },
        },
      ],
    })
  }

  const songsNotInPlaylist = allSongs.filter(
    (s) => !playlistSongs.some((ps) => ps.songId === s.id)
  )

  const addFilteredSongs = useMemo(() => {
    if (!searchAddQuery.trim()) return songsNotInPlaylist
    const lower = searchAddQuery.toLowerCase()
    return songsNotInPlaylist.filter(
      (s) =>
        s.name?.toLowerCase().includes(lower) ||
        s.artist?.toLowerCase().includes(lower)
    )
  }, [songsNotInPlaylist, searchAddQuery])

  const toggleSelect = (songId: string) => {
    setSelectedSongIds((prev) => {
      const next = new Set(prev)
      if (next.has(songId)) next.delete(songId)
      else next.add(songId)
      return next
    })
  }

  const handleReorder = async (event: CustomEvent) => {
    const from = event.detail.from
    const to = event.detail.to
    event.detail.complete()
    if (from === to) return
    const reordered = [...playlistSongs]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    setPlaylistSongs(reordered)
    const updates = reordered.map((item, index) => ({ id: item.id, sortOrder: index + 1 }))
    await playlistService.reorderSongs(updates)
    dispatch(fetchPlaylists())
  }

  const handleAddSongs = async () => {
    setAdding(true)
    for (const songId of selectedSongIds) {
      const nextOrder = playlistSongs.length + 1
      await playlistService.addSong(playlistId, songId, nextOrder)
    }
    setSelectedSongIds(new Set())
    setShowAddModal(false)
    setAdding(false)
    dispatch(fetchPlaylists())
    loadSongs()
  }

  if (showAddModal) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => { setShowAddModal(false); setSelectedSongIds(new Set()); setSearchAddQuery(''); }} fill="clear">
                Voltar
              </IonButton>
            </IonButtons>
            <IonTitle>Adicionar Músicas</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleAddSongs} disabled={selectedSongIds.size === 0 || adding}>
                {adding ? <IonSpinner /> : `Adicionar (${selectedSongIds.size})`}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonSearchbar
            value={searchAddQuery}
            onIonInput={(e) => setSearchAddQuery(String(e.detail.value))}
            placeholder="Buscar músicas ou artistas..."
            animated
          />
          {addFilteredSongs.length === 0 ? (
            <IonText color="medium">
              <p style={{ textAlign: 'center', padding: '2rem' }}>
                {searchAddQuery.trim() ? 'Nenhum resultado encontrado.' : 'Todas as músicas já estão nesta playlist.'}
              </p>
            </IonText>
          ) : (
            <IonList inset style={{ paddingBottom: '80px' }}>
              {addFilteredSongs.map((song) => (
                <IonItem key={song.id} onClick={() => toggleSelect(song.id)}>
                  <IonCheckbox
                    slot="start"
                    checked={selectedSongIds.has(song.id)}
                    onIonChange={() => toggleSelect(song.id)}
                  />
                  <IonLabel>
                    <h2>{song.name}</h2>
                    <p>{song.artist}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onBack} fill="clear">Voltar</IonButton>
          </IonButtons>
          <IonTitle>{playlist?.name ?? 'Playlist'}</IonTitle>
          <IonButtons slot="end" />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <style>{`
          .playlist-song-item {
            --padding-start: 16px;
            --padding-end: 16px;
            --padding-top: 12px;
            --padding-bottom: 12px;
            --border-radius: 12px;
            background: #0a0a1a;
            margin: 0 12px 8px;
            border-radius: 12px;
            border: 1px solid #1a1a2e;
          }
          .playlist-song-item:last-child {
            margin-bottom: 0;
          }
          .playlist-group-header {
            --background: transparent;
            --padding-start: 16px;
            --padding-end: 16px;
            --padding-top: 8px;
            --padding-bottom: 4px;
            --min-height: 32px;
            font-weight: 600;
            color: var(--ion-color-primary, #f9c41b);
          }
        `}</style>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <IonSpinner />
          </div>
        ) : playlistSongs.length === 0 ? (
          <IonText color="medium">
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              Nenhuma música nesta playlist ainda.
            </p>
          </IonText>
        ) : (
          <div style={isDesktop ? { maxWidth: 720, margin: '0 auto', width: '100%' } : undefined}>
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => setSearchQuery(String(e.detail.value))}
              placeholder="Buscar músicas ou artistas..."
              animated
            />
            <div style={{ padding: '0 1rem' }}>
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
            </div>
            {filteredPlaylistSongs.length === 0 ? (
              <IonText color="medium">
                <p style={{ textAlign: 'center', padding: '2rem' }}>
                  Nenhum resultado encontrado.
                </p>
              </IonText>
            ) : (
              <div style={{ padding: '0 4px 80px' }}>
                {groupedSongs ? (
                  <IonReorderGroup disabled={groupBy !== 'none'} onIonItemReorder={handleReorder}>
                  {groupedSongs.map(([groupName, songs]) => (
                    <div key={groupName} style={{ marginBottom: 12 }}>
                      <IonItemDivider className="playlist-group-header">
                        <IonLabel>{groupName}</IonLabel>
                        <IonLabel slot="end" style={{ color: 'var(--ion-color-medium)' }}>{songs.length} {songs.length === 1 ? 'música' : 'músicas'}</IonLabel>
                      </IonItemDivider>
                      {songs.map((ps) => (
                        <IonItemSliding key={ps.id}>
                          <IonItemOptions side="end">
                            <IonItemOption color="danger" onClick={() => confirmRemove(ps.id, ps.song?.name ?? 'Desconhecida')} aria-label={`Remover ${ps.song?.name ?? 'Desconhecida'}`}>
                              <IonIcon slot="icon-only" icon={trash} />
                            </IonItemOption>
                          </IonItemOptions>
                          <IonItem className="playlist-song-item">
                            <IonLabel>
                              <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 2 }}>{ps.song?.name ?? 'Desconhecida'}</h2>
                            </IonLabel>
                          </IonItem>
                        </IonItemSliding>
                      ))}
                    </div>
                  ))}
                  </IonReorderGroup>
                ) : (
                  <IonReorderGroup disabled={groupBy !== 'none'} onIonItemReorder={handleReorder}>
                  {filteredPlaylistSongs.map((ps) => (
                    <IonItemSliding key={ps.id}>
                      <IonItemOptions side="end">
                        <IonItemOption color="danger" onClick={() => confirmRemove(ps.id, ps.song?.name ?? 'Desconhecida')} aria-label={`Remover ${ps.song?.name ?? 'Desconhecida'}`}>
                          <IonIcon slot="icon-only" icon={trash} />
                        </IonItemOption>
                      </IonItemOptions>
                      <IonItem className="playlist-song-item">
                        <IonLabel>
                          <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 2 }}>{ps.song?.name ?? 'Desconhecida'}</h2>
                          <p style={{ color: 'var(--ion-color-medium)', fontSize: '0.85rem' }}>{ps.song?.artist}</p>
                        </IonLabel>
                        {groupBy === 'none' && (
                          <IonReorder slot="end" />
                        )}
                      </IonItem>
                    </IonItemSliding>
                  ))}
                  </IonReorderGroup>
                )}
              </div>
            )}
          </div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ bottom: '16px' }}>
          <IonFabButton onClick={() => setShowAddModal(true)} aria-label="Adicionar músicas">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}
