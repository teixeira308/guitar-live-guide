import { useState, useEffect } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
} from '@ionic/react'
import { checkmark, musicalNotes, list, musicalNote, school, flame } from 'ionicons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { createPlaylistThunk, updatePlaylistThunk } from '../store/playlistSlice'
import { fetchGenres, createGenre } from '../../genres/store/genreSlice'
import { GenreCombobox } from '../../../shared/components/GenreCombobox'
import type { PlaylistType } from '../../../shared/models/playlist'
import type { Genre } from '../../../shared/models/genre'

interface Props {
  playlistId?: string
  onClose: () => void
}

export const PlaylistFormScreen = ({ playlistId, onClose }: Props) => {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.playlists)
  const { items: genres } = useAppSelector((s) => s.genres)
  const playlist = playlistId ? items.find((p) => p.id === playlistId) : undefined
  const isEditing = !!playlist

  const [name, setName] = useState(playlist?.name || '')
  const [description, setDescription] = useState(playlist?.description || '')
  const [genreId, setGenreId] = useState(playlist?.genreId || '')
  const [type, setType] = useState<PlaylistType>(playlist?.type || 'repertoire')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchGenres())
  }, [dispatch])

  const handleSubmit = async () => {
    setError('')
    if (!name.trim()) {
      setError('O nome da playlist é obrigatório')
      return
    }
    setSaving(true)
    try {
      if (isEditing && playlist) {
        await dispatch(updatePlaylistThunk({
          id: playlist.id,
          data: {
            name: name.trim(),
            description: description.trim() || undefined,
            genreId: genreId || undefined,
            type,
          },
        })).unwrap()
      } else {
        await dispatch(createPlaylistThunk({
          name: name.trim(),
          description: description.trim() || undefined,
          genreId: genreId || undefined,
          type,
        })).unwrap()
      }
      onClose()
    } catch (err) {
      setError((err as { message?: string })?.message || 'Falha ao salvar playlist')
    } finally {
      setSaving(false)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose} fill="clear">Voltar</IonButton>
          </IonButtons>
          <IonTitle>{isEditing ? 'Editar Playlist' : 'Nova Playlist'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          {error && (
            <IonText color="danger">
              <p style={{ marginBottom: '1rem' }}>{error}</p>
            </IonText>
          )}

          <IonList inset>
            <IonItem>
              <IonInput
                label="Nome da playlist"
                labelPlacement="floating"
                value={name}
                onIonInput={(e) => setName(String(e.detail.value))}
                required
                autofocus
              />
            </IonItem>
            <IonItem>
              <IonTextarea
                label="Descrição (opcional)"
                labelPlacement="floating"
                value={description}
                onIonInput={(e) => setDescription(String(e.detail.value))}
                rows={3}
                autoGrow
              />
            </IonItem>
            <GenreCombobox
              genres={genres}
              value={genreId}
              onChange={(id) => setGenreId(id)}
              onCreateNew={async (name: string): Promise<Genre | undefined> => {
                const result = await dispatch(createGenre({ name })).unwrap()
                return result
              }}
            />
            <IonItem>
              <div style={{ width: '100%', padding: '0.5rem 0' }}>
                <IonLabel style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem' }}>
                  Tipo
                </IonLabel>
                <IonSegment
                  value={type}
                  onIonChange={(e) => setType(e.detail.value as PlaylistType)}
                >
                  <IonSegmentButton value="repertoire">
                    <IonIcon icon={musicalNotes} />
                    <IonLabel>Repertório</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="setlist">
                    <IonIcon icon={list} />
                    <IonLabel>Setlist</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="rehearsal">
                    <IonIcon icon={guitar} />
                    <IonLabel>Ensaio</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="study">
                    <IonIcon icon={school} />
                    <IonLabel>Estudo</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="warmup">
                    <IonIcon icon={flame} />
                    <IonLabel>Aquecimento</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </div>
            </IonItem>
          </IonList>

          <div style={{ padding: '1rem 0' }}>
            <IonButton expand="block" size="large" onClick={handleSubmit} disabled={saving}>
              {saving ? <IonSpinner /> : <IonIcon slot="start" icon={checkmark} />}
              {isEditing ? 'Salvar' : 'Criar Playlist'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
