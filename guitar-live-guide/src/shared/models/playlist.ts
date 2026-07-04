export interface Playlist {
  id: string
  userId: string
  workspaceId?: string
  name: string
  description?: string
  songCount: number
  createdAt: string
  updatedAt: string
}
