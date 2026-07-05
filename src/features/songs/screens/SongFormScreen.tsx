import { useState, useEffect, useRef, useCallback } from 'react'
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
  IonSpinner,
} from '@ionic/react'
import { musicalNotes, checkmark, close } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { createSong, updateSong } from '../store/songsSlice'
import { ArtistInput } from '../components/ArtistInput'
import { fetchVideoInfo, extractVideoId } from '../../../shared/services/youtube'
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

const UrlValidationPreview = ({ url }: { url: string }) => {
  const videoId = extractVideoId(url)
  if (!url.trim()) return null
  if (!videoId) {
    return (
      <div style={{ padding: '4px 16px 12px' }}>
        <IonText color="danger">
          <p style={{ fontSize: '0.75rem', margin: 0 }}>
            Link inválido — aceita apenas YouTube (youtube.com ou youtu.be)
          </p>
        </IonText>
      </div>
    )
  }
  return (
    <div style={{ padding: '4px 16px 12px' }}>
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt="Preview do vídeo"
        style={{ width: '100%', maxWidth: 240, borderRadius: 8, display: 'block' }}
      />
    </div>
  )
}

function normalizeArtist(artist: string, existing: string[]) {
  const lower = artist.trim().toLowerCase()
  const match = existing.find((a) => a.toLowerCase() === lower)
  return match || artist.trim()
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
  const [saving, setSaving] = useState(false)
  const [fetchingInfo, setFetchingInfo] = useState(false)
  const autoFilledRef = useRef(false)
  const isEditing = !!song
  const formRef = useRef(form)
  formRef.current = form

  useEffect(() => {
    if (form.type === 'improv') {
      setForm((prev) => ({ ...prev, artist: 'Improviso' }))
    }
  }, [form.type])

  const autoFillFromUrl = useCallback(async (url: string) => {
    if (!url || isEditing || autoFilledRef.current) return
    const current = formRef.current
    if (current.name.trim() && current.artist.trim()) return
    setFetchingInfo(true)
    const info = await fetchVideoInfo(url)
    if (info) {
      autoFilledRef.current = true
      setForm((prev) => ({
        ...prev,
        name: prev.name.trim() || info.title,
        artist: prev.artist.trim() || info.author_name,
      }))
    }
    setFetchingInfo(false)
  }, [isEditing])

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) {
      setError('Nome é obrigatório')
      return
    }
    const artist = form.type === 'improv' ? 'Improviso' : form.artist.trim()
    if (!artist) {
      setError('Artista é obrigatório')
      return
    }
    const normalizedArtist = normalizeArtist(artist, items.map((s) => s.artist))
    const data = { ...form, artist: normalizedArtist }
    setSaving(true)
    try {
      if (isEditing && song) {
        await dispatch(updateSong({ id: song.id, data })).unwrap()
      } else {
        await dispatch(
          createSong({
            ...data,
            id: crypto.randomUUID(),
          })
        ).unwrap()
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar música')
    } finally {
      setSaving(false)
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
            <IonBackButton defaultHref="#" onClick={onClose} text="Voltar" />
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
            {form.type === 'repertoire' ? (
              <>
                <IonItem>
                  <IonInput
                    label="URL Original do YouTube"
                    labelPlacement="floating"
                    value={form.youtubeOriginalUrl}
                    onIonInput={(e) => update('youtubeOriginalUrl', String(e.detail.value))}
                    onIonBlur={() => autoFillFromUrl(form.youtubeOriginalUrl)}
                  />
                </IonItem>
                <UrlValidationPreview url={form.youtubeOriginalUrl} />
                <IonItem>
                  <IonInput
                    label="URL da Aula no YouTube"
                    labelPlacement="floating"
                    value={form.youtubeLessonUrl}
                    onIonInput={(e) => update('youtubeLessonUrl', String(e.detail.value))}
                    onIonBlur={() => autoFillFromUrl(form.youtubeLessonUrl)}
                  />
                </IonItem>
                <UrlValidationPreview url={form.youtubeLessonUrl} />
                <IonItem>
                  <IonInput
                    label="URL do Backing Track no YouTube"
                    labelPlacement="floating"
                    value={form.youtubeBackingTrackUrl}
                    onIonInput={(e) => update('youtubeBackingTrackUrl', String(e.detail.value))}
                    onIonBlur={() => autoFillFromUrl(form.youtubeBackingTrackUrl)}
                  />
                </IonItem>
                <UrlValidationPreview url={form.youtubeBackingTrackUrl} />
              </>
            ) : (
              <>
              <IonItem>
                <IonInput
                  label="URL de Improviso no YouTube"
                  labelPlacement="floating"
                  value={form.youtubeImprovisationTrackUrl}
                  onIonInput={(e) => update('youtubeImprovisationTrackUrl', String(e.detail.value))}
                  onIonBlur={() => autoFillFromUrl(form.youtubeImprovisationTrackUrl)}
                />
              </IonItem>
              <UrlValidationPreview url={form.youtubeImprovisationTrackUrl} />
              </>
            )}
            <IonItem>
              <IonInput
                label="Nome da música *"
                labelPlacement="floating"
                value={form.name}
                onIonInput={(e) => update('name', String(e.detail.value))}
                required
              />
              {fetchingInfo && (
                <IonSpinner slot="end" style={{ width: 20, height: 20 }} />
              )}
            </IonItem>
            {form.type === 'repertoire' ? (
              <ArtistInput
                value={form.artist === 'Improviso' ? '' : form.artist}
                onValueChange={(v) => update('artist', v)}
                existingArtists={items.map((s) => s.artist)}
              />
            ) : (
              <IonItem>
                <IonInput
                  label="Artista"
                  labelPlacement="floating"
                  value="Improviso"
                  readonly
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
            <IonButton expand="block" size="large" strong onClick={handleSubmit} disabled={saving} style={isDesktop ? { maxWidth: 320 } : undefined}>
              {saving ? <IonSpinner /> : <IonIcon slot="start" icon={checkmark} />}
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
