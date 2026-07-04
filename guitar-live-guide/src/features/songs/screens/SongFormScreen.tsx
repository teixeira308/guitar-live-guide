import { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonBackButton,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonIcon,
} from '@ionic/react'
import { musicalNotes } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { createSong, updateSong } from '../store/songsSlice'
import type { Song, Difficulty, SongType } from '../../../shared/models/song'

interface SongFormData {
  type: SongType
  name: string
  artist: string
  youtubeOriginalUrl: string
  youtubeLessonUrl: string
  youtubeBackingTrackUrl: string
  youtubeImprovisationTrackUrl: string
  duration: number
  bpm: number
  key: string
  capo: number
  tuning: string
  difficulty: Difficulty
  genreIds: string[]
  sentimentId: string
  notes: string
}

const emptyForm: SongFormData = {
  type: 'repertoire',
  name: '',
  artist: '',
  youtubeOriginalUrl: '',
  youtubeLessonUrl: '',
  youtubeBackingTrackUrl: '',
  youtubeImprovisationTrackUrl: '',
  duration: 0,
  bpm: 0,
  key: '',
  capo: 0,
  tuning: '',
  difficulty: 'intermediate',
  genreIds: [],
  sentimentId: '',
  notes: '',
}

function songToForm(song: Song): SongFormData {
  return {
    type: song.type || 'repertoire',
    name: song.name,
    artist: song.artist,
    youtubeOriginalUrl: song.youtubeOriginalUrl,
    youtubeLessonUrl: song.youtubeLessonUrl,
    youtubeBackingTrackUrl: song.youtubeBackingTrackUrl,
    youtubeImprovisationTrackUrl: song.youtubeImprovisationTrackUrl,
    duration: song.duration,
    bpm: song.bpm,
    key: song.key,
    capo: song.capo,
    tuning: song.tuning,
    difficulty: song.difficulty,
    genreIds: song.genreIds,
    sentimentId: song.sentimentId,
    notes: song.notes ?? '',
  }
}

export const SongFormScreen = ({
  songId,
  onClose,
}: {
  songId?: string
  onClose: () => void
}) => {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.songs)
  const song = songId ? items.find((s) => s.id === songId) : undefined

  const [form, setForm] = useState<SongFormData>(song ? songToForm(song) : emptyForm)
  const [error, setError] = useState('')
  const isEditing = !!song

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim() || !form.artist.trim()) {
      setError('Name and artist are required')
      return
    }
    try {
      if (isEditing && song) {
        await dispatch(updateSong({ id: song.id, data: form })).unwrap()
      } else {
        await dispatch(
          createSong({
            ...form,
            id: crypto.randomUUID(),
          })
        ).unwrap()
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save song')
    }
  }

  const update = <K extends keyof SongFormData>(key: K, value: SongFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'expert']

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#" onClick={onClose} />
          </IonButtons>
          <IonTitle>{isEditing ? 'Edit Song' : 'Add Song'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && (
          <IonText color="danger">
            <p style={{ marginBottom: '1rem' }}>{error}</p>
          </IonText>
        )}

        <IonSegment
          value={form.type}
          onIonChange={(e) => update('type', e.detail.value as SongType)}
        >
          <IonSegmentButton value="repertoire">
            <IonIcon icon={musicalNotes} />
            <IonLabel>Repertoire</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="improv">
            <IonIcon icon={musicalNotes} />
            <IonLabel>Improv</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonList inset style={{ marginTop: '1.5rem' }}>
          <IonItem>
            <IonLabel position="floating">Song name *</IonLabel>
            <IonInput
              value={form.name}
              onIonInput={(e) => update('name', String(e.detail.value))}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Artist *</IonLabel>
            <IonInput
              value={form.artist}
              onIonInput={(e) => update('artist', String(e.detail.value))}
              required
            />
          </IonItem>

          {form.type === 'repertoire' ? (
            <>
              <IonItem>
                <IonLabel position="floating">YouTube Original URL</IonLabel>
                <IonInput
                  value={form.youtubeOriginalUrl}
                  onIonInput={(e) => update('youtubeOriginalUrl', String(e.detail.value))}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">YouTube Lesson URL</IonLabel>
                <IonInput
                  value={form.youtubeLessonUrl}
                  onIonInput={(e) => update('youtubeLessonUrl', String(e.detail.value))}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">YouTube Backing Track URL</IonLabel>
                <IonInput
                  value={form.youtubeBackingTrackUrl}
                  onIonInput={(e) => update('youtubeBackingTrackUrl', String(e.detail.value))}
                />
              </IonItem>
            </>
          ) : (
            <IonItem>
              <IonLabel position="floating">YouTube Improvisation URL</IonLabel>
              <IonInput
                value={form.youtubeImprovisationTrackUrl}
                onIonInput={(e) => update('youtubeImprovisationTrackUrl', String(e.detail.value))}
              />
            </IonItem>
          )}
        </IonList>

        <details style={{ margin: '1rem 0' }}>
          <summary style={{ color: 'var(--ion-color-primary)', cursor: 'pointer', padding: '0.5rem 0' }}>
            Additional Info
          </summary>
          <IonList inset style={{ marginTop: '0.5rem' }}>
            <IonItem>
              <IonLabel position="floating">Duration (sec)</IonLabel>
              <IonInput
                type="number"
                value={form.duration || ''}
                onIonInput={(e) => update('duration', Number(e.detail.value))}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">BPM</IonLabel>
              <IonInput
                type="number"
                value={form.bpm || ''}
                onIonInput={(e) => update('bpm', Number(e.detail.value))}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Key (e.g., E, Gm)</IonLabel>
              <IonInput
                value={form.key}
                onIonInput={(e) => update('key', String(e.detail.value))}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Capo</IonLabel>
              <IonInput
                type="number"
                value={form.capo || ''}
                onIonInput={(e) => update('capo', Number(e.detail.value))}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Tuning (e.g., Standard, Drop D)</IonLabel>
              <IonInput
                value={form.tuning}
                onIonInput={(e) => update('tuning', String(e.detail.value))}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Difficulty</IonLabel>
              <IonSelect
                value={form.difficulty}
                onIonChange={(e) => update('difficulty', e.detail.value as Difficulty)}
              >
                {difficulties.map((d) => (
                  <IonSelectOption key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Notes (optional)</IonLabel>
              <IonTextarea
                value={form.notes}
                onIonInput={(e) => update('notes', String(e.detail.value))}
                rows={3}
              />
            </IonItem>
          </IonList>
        </details>

        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem 0' }}>
          <IonButton expand="block" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Save Song'}
          </IonButton>
          <IonButton expand="block" fill="outline" onClick={onClose}>
            Cancel
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}
