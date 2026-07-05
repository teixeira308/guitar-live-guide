export type PlaylistType = 'repertoire' | 'setlist' | 'rehearsal' | 'study' | 'warmup'

export const PLAYLIST_TYPE_LABELS: Record<PlaylistType, string> = {
  repertoire: 'Repertório',
  setlist: 'Setlist',
  rehearsal: 'Ensaio',
  study: 'Estudo',
  warmup: 'Aquecimento',
}

export const PLAYLIST_TYPE_DESCRIPTIONS: Record<PlaylistType, string> = {
  repertoire: 'Músicas que você sabe tocar (catálogo)',
  setlist: 'Ordem definida para uma apresentação ou evento',
  rehearsal: 'Músicas separadas para ensaiar',
  study: 'Músicas que está aprendendo',
  warmup: 'Exercícios e músicas de aquecimento',
}

export interface Playlist {
  id: string
  userId: string
  workspaceId?: string
  name: string
  description?: string
  genreId?: string
  type: PlaylistType
  estimatedDuration: number
  lastPerformedAt?: string
  timesPlayed: number
  songCount: number
  createdAt: string
  updatedAt: string
}
