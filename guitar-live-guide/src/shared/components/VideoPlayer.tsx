import { useState, useMemo, useEffect } from 'react'
import { IonSegment, IonSegmentButton, IonLabel, IonText } from '@ionic/react'
import ReactPlayer from 'react-player'

export type VideoSource = 'original' | 'lesson' | 'backingTrack' | 'improvisation'

interface VideoPlayerProps {
  originalUrl: string
  lessonUrl: string
  backingTrackUrl: string
  improvisationTrackUrl: string
  playing?: boolean
  initialSource?: VideoSource
  onVideoEnded?: () => void
}

const labels: Record<VideoSource, string> = {
  original: 'Original',
  lesson: 'Aula',
  backingTrack: 'Backing Track',
  improvisation: 'Improviso',
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  if (match) return match[1]
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
  return null
}

export const VideoPlayer = ({ originalUrl, lessonUrl, backingTrackUrl, improvisationTrackUrl, playing = true, initialSource, onVideoEnded }: VideoPlayerProps) => {
  const [source, setSource] = useState<VideoSource>(initialSource || 'original')

  const urls: Record<VideoSource, string> = {
    original: originalUrl,
    lesson: lessonUrl,
    backingTrack: backingTrackUrl,
    improvisation: improvisationTrackUrl,
  }

  const playerSrc = useMemo(() => {
    const raw = urls[source]
    if (!raw) return ''
    const id = extractYoutubeId(raw)
    return id ? `https://www.youtube.com/watch?v=${id}` : raw
  }, [urls, source])

  const availableSources = useMemo(
    () => (Object.keys(labels) as VideoSource[]).filter((key) => urls[key]),
    [urls]
  )

  useEffect(() => {
    if (!urls[source] && availableSources.length > 0) {
      setSource(availableSources[0])
    }
  }, [urls, source, availableSources])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {availableSources.length > 1 && (
        <IonSegment
          value={source}
          onIonChange={(e) => {
            const val = e.detail.value as VideoSource
            if (val) setSource(val)
          }}
        >
          {availableSources.map((key) => (
            <IonSegmentButton key={key} value={key}>
              <IonLabel>{labels[key]}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>
      )}
      <div
        style={{
          aspectRatio: '16 / 9',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
          background: 'var(--ion-card-background, #1a1a2e)',
        }}
      >
        {playerSrc ? (
          <ReactPlayer
            src={playerSrc}
            width="100%"
            height="100%"
            controls
            playing={playing}
            onEnded={onVideoEnded}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 1rem',
            }}
          >
            <IonText color="medium">
              <p style={{ textAlign: 'center' }}>Nenhuma URL fornecida para esta fonte</p>
            </IonText>
          </div>
        )}
      </div>
    </div>
  )
}
