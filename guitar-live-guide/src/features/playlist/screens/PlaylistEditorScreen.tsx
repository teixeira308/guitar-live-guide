import { useEffect, useMemo, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonModal,
  IonCheckbox,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonSegment,
  IonSegmentButton,
  IonItemDivider,
  IonSearchbar,
} from '@ionic/react'
import { add, trash, flame, musicalNote, people, key } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchPlaylists } from '../store/playlistSlice'
import { fetchSongs } from '../../songs/store/songsSlice'
import { playlistService } from '../services/playlistService'
import type { Song } from '../../../shared/models/song'
import type { PlaylistSong } from '../../../shared/models/playlistSong'

interface Props {
  playlistId: string
  onBack: () => void
}

export const PlaylistEditorScreen = ({ playlistId, onBack }: Props) => {
  const dispatch = useAppDispatch()
  const { items: playlists } = useAppSelector((s) => s.playlists)
  const { items: allSongs } = useAppSelector((s) => s.songs)
  const [playlistSongs, setPlaylistSongs] = useState<(PlaylistSong & { song?: Song })[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [groupBy, setGroupBy] = useState<'none' | 'artist' | 'difficulty' | 'key'>('none')
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleRemove = async (playlistSongId: string) => {
    await playlistService.removeSong(playlistSongId)
    dispatch(fetchPlaylists())
    loadSongs()
  }

  const songsNotInPlaylist = allSongs.filter(
    (s) => !playlistSongs.some((ps) => ps.songId === s.id)
  )

  const toggleSelect = (songId: string) => {
    setSelectedSongIds((prev) => {
      const next = new Set(prev)
      if (next.has(songId)) next.delete(songId)
      else next.add(songId)
      return next
    })
  }

  const handleAddSongs = async () => {
    for (const songId of selectedSongIds) {
      const nextOrder = playlistSongs.length + 1
      await playlistService.addSong(playlistId, songId, nextOrder)
    }
    setSelectedSongIds(new Set())
    setShowAddModal(false)
    dispatch(fetchPlaylists())
    loadSongs()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#" onClick={onBack} text="Voltar" />
          </IonButtons>
          <IonTitle>{playlist?.name ?? 'Playlist'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowAddModal(true)}>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
          <>
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
              <IonList inset>
                {groupedSongs ? (
                  groupedSongs.map(([groupName, songs]) => (
                    <div key={groupName}>
                      <IonItemDivider>
                        <IonLabel>{groupName}</IonLabel>
                        <IonLabel slot="end">{songs.length} {songs.length === 1 ? 'música' : 'músicas'}</IonLabel>
                      </IonItemDivider>
                      {songs.map((ps, idx) => (
                        <IonItemSliding key={ps.id}>
                          <IonItemOptions side="end">
                            <IonItemOption color="danger" onClick={() => handleRemove(ps.id)} aria-label={`Remover ${ps.song?.name ?? 'Desconhecida'}`}>
                              <IonIcon slot="icon-only" icon={trash} />
                            </IonItemOption>
                          </IonItemOptions>
                          <IonItem>
                            <IonLabel slot="start" style={{ flex: '0 0 2rem', textAlign: 'center', color: 'var(--ion-color-medium)' }}>
                              <IonText color="medium">{idx + 1}</IonText>
                            </IonLabel>
                            <IonLabel>
                              <h2>{ps.song?.name ?? 'Desconhecida'}</h2>
                              <p>{ps.song?.artist}</p>
                            </IonLabel>
                          </IonItem>
                        </IonItemSliding>
                      ))}
                    </div>
                  ))
                ) : (
                  filteredPlaylistSongs.map((ps, idx) => (
                    <IonItemSliding key={ps.id}>
                      <IonItemOptions side="end">
                        <IonItemOption color="danger" onClick={() => handleRemove(ps.id)} aria-label={`Remover ${ps.song?.name ?? 'Desconhecida'}`}>
                          <IonIcon slot="icon-only" icon={trash} />
                        </IonItemOption>
                      </IonItemOptions>
                      <IonItem>
                        <IonLabel slot="start" style={{ flex: '0 0 2rem', textAlign: 'center', color: 'var(--ion-color-medium)' }}>
                          <IonText color="medium">{idx + 1}</IonText>
                        </IonLabel>
                        <IonLabel>
                          <h2>{ps.song?.name ?? 'Desconhecida'}</h2>
                          <p>{ps.song?.artist}</p>
                        </IonLabel>
                      </IonItem>
                    </IonItemSliding>
                  ))
                )}
              </IonList>
            )}
          </>
        )}

        <IonModal
          isOpen={showAddModal}
          onDidDismiss={() => {
            setShowAddModal(false)
            setSelectedSongIds(new Set())
          }}
          breakpoints={[0.25, 0.5, 0.75]}
          initialBreakpoint={0.5}
        >
          <div style={{ padding: '1rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Adicionar Músicas</h2>
            {songsNotInPlaylist.length === 0 ? (
              <IonText color="medium">
                <p>Todas as músicas já estão nesta playlist.</p>
              </IonText>
            ) : (
              <IonList inset>
                {songsNotInPlaylist.map((song) => (
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
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <IonButton
                expand="block"
                onClick={handleAddSongs}
                disabled={selectedSongIds.size === 0}
              >
                Adicionar ({selectedSongIds.size})
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => {
                  setShowAddModal(false)
                  setSelectedSongIds(new Set())
                }}
              >
                Cancelar
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}
