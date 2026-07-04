import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { songService } from '../services/songService'
import type { Song } from '../../../shared/models/song'

interface SongsState {
  items: Song[]
  loading: boolean
  error: string | null
  lastFetched: number | null
}

const initialState: SongsState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
}

export const fetchSongs = createAsyncThunk('songs/fetchAll', async () => {
  return songService.getAll()
})

export const createSong = createAsyncThunk(
  'songs/create',
  async (data: Omit<Song, 'userId' | 'createdAt' | 'updatedAt'>) => {
    return songService.create(data)
  }
)

export const updateSong = createAsyncThunk(
  'songs/update',
  async ({ id, data }: { id: string; data: Partial<Song> }) => {
    await songService.update(id, data)
    return { id, data }
  }
)

export const deleteSong = createAsyncThunk(
  'songs/delete',
  async (id: string) => {
    await songService.delete(id)
    return id
  }
)

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch songs'
      })
      .addCase(createSong.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(deleteSong.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload)
      })
      .addCase(updateSong.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id)
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload.data }
        }
      })
  },
})

export const songsReducer = songsSlice.reducer
