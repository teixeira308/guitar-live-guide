export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type SongType = 'repertoire' | 'improv'

export interface Song {
  id: string
  userId: string
  workspaceId?: string
  name: string
  artist: string
  type: SongType
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
  notes?: string
  createdAt: string
  updatedAt: string
}
