import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
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
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonSpinner,
} from '@ionic/react'
import {
  playSkipBack,
  playSkipForward,
  play,
  pause,
  checkmarkCircle,
  musicalNotes,
  bulb,
} from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchSongs } from '../../songs/store/songsSlice'
import { updateSong } from '../../songs/store/songsSlice'
import { playlistService } from '../../playlist/services/playlistService'
import { VideoPlayer } from '../../../shared/components/VideoPlayer'
import { SessionTimer } from '../../../shared/components/SessionTimer'
import {
  startSession,
  tickTimer,
  markSongPlaying,
  markSongPlayed,
  endSession,
} from '../store/sessionSlice'
import type { Song } from '../../../shared/models/song'
import type { SessionMode } from './SessionModeDialog'
import type { VideoSource } from '../../../shared/components/VideoPlayer'
import { SessionSummaryScreen } from './SessionSummaryScreen'
import type { SongStat } from './SessionSummaryScreen'

interface LiveSessionScreenProps {
  playlistId?: string
  sessionMode?: SessionMode
  onBack?: () => void
}

const modeToSource: Record<SessionMode, VideoSource> = {
  lesson: 'lesson',
  backingTrack: 'backingTrack',
}

export const LiveSessionScreen = ({
  playlistId,
  sessionMode = 'backingTrack',
  onBack,
}: LiveSessionScreenProps) => {
  const dispatch = useAppDispatch()
  const { items: allSongs } = useAppSelector((s) => s.songs)
  const { activeSession, sessionSongs, elapsedSeconds } = useAppSelector(
    (s) => s.session
  )
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [currentSongNotes, setCurrentSongNotes] = useState('')
  const notesSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [starting, setStarting] = useState(false)
  const [markingPlayed, setMarkingPlayed] = useState(false)
  const [ending, setEnding] = useState(false)
  const [activeTab, setActiveTab] = useState<'songs' | 'suggestions'>('songs')
  const songTimersRef = useRef<Record<string, number>>({})
  const hasAutoSelectedRef = useRef(false)
  const [playlistSongIds, setPlaylistSongIds] = useState<string[]>([])

  useEffect(() => {
    dispatch(fetchSongs())
  }, [dispatch])

  useEffect(() => {
    if (!playlistId) {
      setPlaylistSongIds([])
      return
    }
    playlistService.getSongs(playlistId).then((ps) => {
      setPlaylistSongIds(ps.sort((a, b) => a.sortOrder - b.sortOrder).map((p) => p.songId))
    })
  }, [playlistId])

  const songs = useMemo(
    () =>
      playlistId && playlistSongIds.length > 0
        ? playlistSongIds.map((id) => allSongs.find((s) => s.id === id)).filter(Boolean) as Song[]
        : allSongs,
    [allSongs, playlistId, playlistSongIds]
  )

  useEffect(() => {
    if (activeSession && songs.length > 0 && !hasAutoSelectedRef.current) {
      hasAutoSelectedRef.current = true
      const firstSong = songs[0]
      dispatch(
        markSongPlaying({
          sessionId: activeSession.id,
          songId: firstSong.id,
        })
      )
      setIsPlaying(true)
    }
  }, [activeSession, songs, dispatch])

  useEffect(() => {
    if (activeSession?.status === 'active') {
      timerRef.current = setInterval(() => {
        dispatch(tickTimer())
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeSession?.status, dispatch])

  const handleStartSession = useCallback(async () => {
    setStarting(true)
    await dispatch(startSession(playlistId))
    if (playlistId) {
      playlistService.markAsPerformed(playlistId)
    }
    setStarting(false)
  }, [dispatch, playlistId])

  const currentSong: Song | null = (() => {
    const playing = sessionSongs.find((s) => s.status === 'playing')
    if (!playing) return null
    return songs.find((s) => s.id === playing.songId) || null
  })()

  const currentIndex = currentSong
    ? songs.findIndex((s) => s.id === currentSong.id)
    : -1

  const recordDuration = useCallback(
    (songId: string) => {
      const start = songTimersRef.current[songId]
      if (start !== undefined) {
        const duration = elapsedSeconds - start
        songTimersRef.current[songId] = duration
      }
    },
    [elapsedSeconds]
  )

  const startTimerForSong = useCallback(
    (songId: string) => {
      songTimersRef.current[songId] = elapsedSeconds
    },
    [elapsedSeconds]
  )

  const handleSelectSong = useCallback(
    (song: Song) => {
      if (!activeSession) return
      if (currentSong) recordDuration(currentSong.id)
      dispatch(
        markSongPlaying({
          sessionId: activeSession.id,
          songId: song.id,
        })
      )
      startTimerForSong(song.id)
      setIsPlaying(true)
    },
    [activeSession, currentSong, dispatch, recordDuration, startTimerForSong]
  )

  const handleMarkPlayed = useCallback(async () => {
    if (!activeSession || !currentSong) return
    setMarkingPlayed(true)
    recordDuration(currentSong.id)
    await dispatch(
      markSongPlayed({
        sessionId: activeSession.id,
        songId: currentSong.id,
      })
    )
    setMarkingPlayed(false)
  }, [activeSession, currentSong, dispatch, recordDuration])

  const handleEndSession = useCallback(async () => {
    if (currentSong) recordDuration(currentSong.id)
    if (activeSession) {
      setEnding(true)
      await dispatch(endSession(activeSession.id))
      setEnding(false)
    }
    setShowSummary(true)
  }, [activeSession, currentSong, dispatch, recordDuration])

  const handleVideoEnded = useCallback(() => {
    if (!activeSession || !currentSong) return
    recordDuration(currentSong.id)
    dispatch(
      markSongPlayed({
        sessionId: activeSession.id,
        songId: currentSong.id,
      })
    )

    const nextSong = songs.find((s) => {
      const ss = sessionSongs.find((ss) => ss.songId === s.id)
      return !ss || ss.status === 'pending'
    })

    if (nextSong) {
      dispatch(
        markSongPlaying({
          sessionId: activeSession.id,
          songId: nextSong.id,
        })
      )
      startTimerForSong(nextSong.id)
      setIsPlaying(true)
    } else {
      dispatch(endSession(activeSession.id))
      setShowSummary(true)
    }
  }, [
    activeSession,
    currentSong,
    songs,
    sessionSongs,
    dispatch,
    recordDuration,
    startTimerForSong,
  ])

  const handlePrevious = useCallback(() => {
    if (currentIndex <= 0 || !activeSession) return
    if (currentSong) recordDuration(currentSong.id)
    const prevSong = songs[currentIndex - 1]
    dispatch(
      markSongPlaying({
        sessionId: activeSession.id,
        songId: prevSong.id,
      })
    )
    startTimerForSong(prevSong.id)
    setIsPlaying(true)
  }, [currentIndex, currentSong, songs, activeSession, dispatch, recordDuration, startTimerForSong])

  const handleNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= songs.length - 1 || !activeSession) return
    if (currentSong) recordDuration(currentSong.id)
    const nextSong = songs[currentIndex + 1]
    dispatch(
      markSongPlaying({
        sessionId: activeSession.id,
        songId: nextSong.id,
      })
    )
    startTimerForSong(nextSong.id)
    setIsPlaying(true)
  }, [currentIndex, currentSong, songs, activeSession, dispatch, recordDuration, startTimerForSong])

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  useEffect(() => {
    setCurrentSongNotes(currentSong?.notes || '')
  }, [currentSong?.id])

  const handleNotesChange = (value: string) => {
    setCurrentSongNotes(value)
    if (notesSaveRef.current) clearTimeout(notesSaveRef.current)
    notesSaveRef.current = setTimeout(() => {
      if (currentSong) {
        dispatch(updateSong({ id: currentSong.id, data: { notes: value } }))
      }
    }, 1000)
  }

  const getSongStatus = (songId: string) => {
    const ss = sessionSongs.find((s) => s.songId === songId)
    return ss?.status || 'pending'
  }

  const playedCount = sessionSongs.filter((s) => s.status === 'played').length

  if (showSummary) {
    const summarySongs: SongStat[] = songs.map((song) => {
      const status = getSongStatus(song.id)
      const duration = songTimersRef.current[song.id] ?? 0
      return {
        name: song.name,
        artist: song.artist,
        status: status as 'played' | 'playing' | 'pending',
        duration,
      }
    })
    return (
      <SessionSummaryScreen
        songs={summarySongs}
        totalSessionTime={elapsedSeconds}
        onBackToDashboard={() => onBack?.()}
      />
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {onBack && <IonBackButton defaultHref="#" onClick={onBack} text="Voltar" />}
          </IonButtons>
          <IonTitle style={{ fontSize: '1rem' }}>
            {currentSong?.name ?? 'Player'}
          </IonTitle>
          <IonButtons slot="end">
            {activeSession && <SessionTimer elapsedSeconds={elapsedSeconds} />}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Video Player */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0.5rem' }}>
            {!activeSession && (
              <div style={{ padding: '1rem' }}>
                <IonButton expand="block" size="large" onClick={handleStartSession} disabled={starting}>
                  {starting ? <IonSpinner /> : null}
                  Iniciar Sessão
                </IonButton>
              </div>
            )}
            <VideoPlayer
              originalUrl={currentSong?.youtubeOriginalUrl || ''}
              lessonUrl={currentSong?.youtubeLessonUrl || ''}
              backingTrackUrl={currentSong?.youtubeBackingTrackUrl || ''}
              improvisationTrackUrl={currentSong?.youtubeImprovisationTrackUrl || ''}
              playing={isPlaying}
              initialSource={modeToSource[sessionMode]}
              onVideoEnded={handleVideoEnded}
            />
          </div>

          {/* Notes */}
          {currentSong && (
            <div style={{ padding: '0.25rem 0.75rem' }}>
              <IonTextarea
                value={currentSongNotes}
                onIonInput={(e) => handleNotesChange(String(e.detail.value))}
                placeholder="Adicionar anotações..."
                rows={1}
                autoGrow
                fill="outline"
                label="Anotações"
                labelPlacement="floating"
              />
            </div>
          )}

          {/* Playback Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderTop: '1px solid var(--ion-border-color)',
            }}
          >
            <IonButton
              fill="clear"
              onClick={handlePrevious}
              disabled={currentIndex <= 0 || !activeSession}
              aria-label="Música anterior"
            >
              <IonIcon slot="icon-only" icon={playSkipBack} style={{ fontSize: 28 }} />
            </IonButton>
            <IonButton
              fill="clear"
              onClick={handleTogglePlay}
              disabled={!currentSong || !activeSession}
              color="primary"
              aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            >
              <IonIcon
                slot="icon-only"
                icon={isPlaying ? pause : play}
                style={{ fontSize: 40 }}
              />
            </IonButton>
            <IonButton
              fill="clear"
              onClick={handleNext}
              disabled={currentIndex < 0 || currentIndex >= songs.length - 1 || !activeSession}
              aria-label="Próxima música"
            >
              <IonIcon slot="icon-only" icon={playSkipForward} style={{ fontSize: 28 }} />
            </IonButton>
            <div style={{ flex: 1 }} />
            <IonButton
              size="small"
              color="success"
              onClick={handleMarkPlayed}
              disabled={!currentSong || !activeSession || markingPlayed}
              aria-label="Marcar como tocada"
            >
              {markingPlayed ? <IonSpinner /> : <IonIcon slot="start" icon={checkmarkCircle} />}
              Concluído
            </IonButton>
            <IonButton
              size="small"
              color="danger"
              onClick={handleEndSession}
              disabled={!activeSession || ending}
              aria-label="Encerrar sessão"
            >
              {ending ? <IonSpinner /> : null}
              Encerrar
            </IonButton>
          </div>

          {/* Segment Tabs */}
          <IonSegment
            value={activeTab}
            onIonChange={(e) => setActiveTab(e.detail.value as 'songs' | 'suggestions')}
          >
            <IonSegmentButton value="songs">
              <IonIcon icon={musicalNotes} />
              <IonLabel>Músicas</IonLabel>
              <IonBadge color="primary">{playedCount}/{sessionSongs.length}</IonBadge>
            </IonSegmentButton>
            <IonSegmentButton value="suggestions">
              <IonIcon icon={bulb} />
              <IonLabel>Sugestões</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {/* Tab Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
            {activeTab === 'songs' ? (
              songs.length === 0 ? (
                <IonText color="medium">
                  <p style={{ textAlign: 'center', padding: '1rem' }}>Nenhuma música ainda</p>
                </IonText>
              ) : (
                <IonList inset style={{ margin: 0 }}>
                  {songs.map((song) => {
                    const status = getSongStatus(song.id)
                    return (
                      <IonItem
                        key={song.id}
                        button
                        onClick={() => handleSelectSong(song)}
                        color={
                          status === 'playing'
                            ? 'primary'
                            : status === 'played'
                              ? undefined
                              : undefined
                        }
                      >
                        <IonLabel>
                          <h2>{song.name}</h2>
                          <p>{song.artist}</p>
                        </IonLabel>
                        <IonIcon
                          slot="end"
                          icon={
                            status === 'played'
                              ? checkmarkCircle
                              : status === 'playing'
                                ? musicalNotes
                                : undefined
                          }
                          color={
                            status === 'played'
                              ? 'success'
                              : status === 'playing'
                                ? 'primary'
                                : undefined
                          }
                        />
                      </IonItem>
                    )
                  })}
                </IonList>
              )
            ) : currentSong && activeSession ? (
              <IonList inset style={{ margin: 0 }}>
                {songs
                  .filter((s) => {
                    const status = getSongStatus(s.id)
                    return status !== 'played' && s.id !== currentSong.id
                  })
                  .slice(0, 5)
                  .map((song) => {
                    const sameArtist = song.artist === currentSong.artist
                    const sharedGenres = song.genreIds.filter((g) =>
                      currentSong.genreIds.includes(g)
                    ).length
                    const sameSentiment =
                      song.sentimentId === currentSong.sentimentId
                    let reason = ''
                    if (sameArtist) reason = 'Mesmo artista'
                    else if (sharedGenres > 0) reason = 'Mesmo gênero'
                    else if (sameSentiment) reason = 'Mesmo sentimento'

                    return (
                      <IonItem
                        key={song.id}
                        button
                        onClick={() => handleSelectSong(song)}
                      >
                        <IonLabel>
                          <h2>{song.name}</h2>
                          <p>{song.artist}</p>
                          {reason && (
                            <p style={{ color: 'var(--ion-color-primary)', fontSize: '0.75rem' }}>
                              {reason}
                            </p>
                          )}
                        </IonLabel>
                      </IonItem>
                    )
                  })}
              </IonList>
            ) : (
              <IonText color="medium">
                <p style={{ textAlign: 'center', padding: '1rem' }}>
                  {activeSession
                    ? 'Selecione uma música para ver sugestões'
                    : 'Inicie uma sessão para ver sugestões'}
                </p>
              </IonText>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
