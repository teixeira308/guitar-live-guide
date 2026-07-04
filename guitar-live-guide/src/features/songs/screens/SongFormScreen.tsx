import { useState } from 'react'
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery'
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
import { musicalNotes, checkmark, close } from 'ionicons/icons'
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
      setError('Nome e artista são obrigatórios')
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
      setError(err instanceof Error ? err.message : 'Falha ao salvar música')
    }
  }

  const update = <K extends keyof SongFormData>(key: K, value: SongFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'expert']
  const difficultyLabels: Record<Difficulty, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    expert: 'Expert',
  }
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#" onClick={onClose} />
          </IonButtons>
          <IonTitle>{isEditing ? 'Editar Música' : 'Adicionar Música'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={isDesktop ? { maxWidth: 720, margin: '0 auto' } : undefined}>
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
              <IonLabel>Repertório</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="improv">
              <IonIcon icon={musicalNotes} />
              <IonLabel>Improviso</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <IonList inset style={{ marginTop: '1.5rem' }}>
            <IonItem>
              <IonInput
                label="Nome da música *"
                labelPlacement="floating"
                value={form.name}
                onIonInput={(e) => update('name', String(e.detail.value))}
                required
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Artista *"
                labelPlacement="floating"
                value={form.artist}
                onIonInput={(e) => update('artist', String(e.detail.value))}
                required
              />
            </IonItem>

            {form.type === 'repertoire' ? (
              <>
                <IonItem>
                  <IonInput
                    label="URL Original do YouTube"
                    labelPlacement="floating"
                    value={form.youtubeOriginalUrl}
                    onIonInput={(e) => update('youtubeOriginalUrl', String(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="URL da Aula no YouTube"
                    labelPlacement="floating"
                    value={form.youtubeLessonUrl}
                    onIonInput={(e) => update('youtubeLessonUrl', String(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="URL do Backing Track no YouTube"
                    labelPlacement="floating"
                    value={form.youtubeBackingTrackUrl}
                    onIonInput={(e) => update('youtubeBackingTrackUrl', String(e.detail.value))}
                  />
                </IonItem>
              </>
            ) : (
              <IonItem>
                <IonInput
                  label="URL de Improviso no YouTube"
                  labelPlacement="floating"
                  value={form.youtubeImprovisationTrackUrl}
                  onIonInput={(e) => update('youtubeImprovisationTrackUrl', String(e.detail.value))}
                />
              </IonItem>
            )}
          </IonList>

          <details style={{ margin: '1rem 0' }} open={isDesktop}>
            <summary style={{ color: 'var(--ion-color-primary)', cursor: 'pointer', padding: '0.5rem 0' }}>
              Informações Adicionais
            </summary>
            {isDesktop ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <IonItem>
                  <IonInput
                    label="Duração (seg)"
                    labelPlacement="floating"
                    type="number"
                    value={form.duration || ''}
                    onIonInput={(e) => update('duration', Number(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="BPM"
                    labelPlacement="floating"
                    type="number"
                    value={form.bpm || ''}
                    onIonInput={(e) => update('bpm', Number(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Tom (ex: E, Gm)"
                    labelPlacement="floating"
                    value={form.key}
                    onIonInput={(e) => update('key', String(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Capo"
                    labelPlacement="floating"
                    type="number"
                    value={form.capo || ''}
                    onIonInput={(e) => update('capo', Number(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Afinação (ex: Standard, Drop D)"
                    labelPlacement="floating"
                    value={form.tuning}
                    onIonInput={(e) => update('tuning', String(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonSelect
                    label="Dificuldade"
                    labelPlacement="floating"
                    value={form.difficulty}
                    onIonChange={(e) => update('difficulty', e.detail.value as Difficulty)}
                  >
                    {difficulties.map((d) => (
                      <IonSelectOption key={d} value={d}>
                        {difficultyLabels[d]}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem style={{ gridColumn: '1 / -1' }}>
                  <IonTextarea
                    label="Anotações (opcional)"
                    labelPlacement="floating"
                    value={form.notes}
                    onIonInput={(e) => update('notes', String(e.detail.value))}
                    rows={3}
                  />
                </IonItem>
              </div>
            ) : (
              <IonList inset style={{ marginTop: '0.5rem' }}>
                <IonItem>
                  <IonInput
                    label="Duração (seg)"
                    labelPlacement="floating"
                    type="number"
                    value={form.duration || ''}
                    onIonInput={(e) => update('duration', Number(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="BPM"
                    labelPlacement="floating"
                    type="number"
                    value={form.bpm || ''}
                    onIonInput={(e) => update('bpm', Number(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Tom (ex: E, Gm)"
                    labelPlacement="floating"
                    value={form.key}
                    onIonInput={(e) => update('key', String(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Capo"
                    labelPlacement="floating"
                    type="number"
                    value={form.capo || ''}
                    onIonInput={(e) => update('capo', Number(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Afinação (ex: Standard, Drop D)"
                    labelPlacement="floating"
                    value={form.tuning}
                    onIonInput={(e) => update('tuning', String(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonSelect
                    label="Dificuldade"
                    labelPlacement="floating"
                    value={form.difficulty}
                    onIonChange={(e) => update('difficulty', e.detail.value as Difficulty)}
                  >
                    {difficulties.map((d) => (
                      <IonSelectOption key={d} value={d}>
                        {difficultyLabels[d]}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonTextarea
                    label="Anotações (opcional)"
                    labelPlacement="floating"
                    value={form.notes}
                    onIonInput={(e) => update('notes', String(e.detail.value))}
                    rows={3}
                  />
                </IonItem>
              </IonList>
            )}
          </details>

          <div style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', justifyContent: isDesktop ? 'center' : undefined, gap: '0.75rem', padding: '1rem 0' }}>
            <IonButton expand="block" size="large" strong onClick={handleSubmit} style={isDesktop ? { maxWidth: 320 } : undefined}>
              <IonIcon slot="start" icon={checkmark} />
              {isEditing ? 'Salvar Alterações' : 'Salvar Música'}
            </IonButton>
            {!isDesktop && (
              <IonButton expand="block" size="large" fill="outline" onClick={onClose}>
                <IonIcon slot="start" icon={close} />
                Cancelar
              </IonButton>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
