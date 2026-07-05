import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { playlistService } from '../services/playlistService'
import type { Playlist, PlaylistType } from '../../../shared/models/playlist'

interface PlaylistState {
  items: Playlist[]
  activePlaylistId: string | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

const initialState: PlaylistState = {
  items: [],
  activePlaylistId: null,
  loading: false,
  error: null,
  lastFetched: null,
}

export const fetchPlaylists = createAsyncThunk('playlists/fetchAll', async () => {
  return playlistService.getAll()
})

export const createPlaylistThunk = createAsyncThunk(
  'playlists/create',
  async (data: { name: string; description?: string; genreId?: string; type: PlaylistType }) => {
    return playlistService.create(data)
  }
)

export const updatePlaylistThunk = createAsyncThunk(
  'playlists/update',
  async ({ id, data }: { id: string; data: Partial<Playlist> }) => {
    await playlistService.update(id, data)
    return { id, data }
  }
)

export const deletePlaylistThunk = createAsyncThunk(
  'playlists/delete',
  async (id: string) => {
    await playlistService.delete(id)
    return id
  }
)

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setActivePlaylist(state, action) {
      state.activePlaylistId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch playlists'
      })
      .addCase(createPlaylistThunk.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updatePlaylistThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload.data }
        }
      })
      .addCase(deletePlaylistThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
  },
})

export const { setActivePlaylist } = playlistSlice.actions
export const playlistReducer = playlistSlice.reducer
