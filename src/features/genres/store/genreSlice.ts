import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { genreService } from '../services/genreService'
import type { Genre } from '../../../shared/models/genre'

interface GenreState {
  items: Genre[]
  loading: boolean
  error: string | null
}

const initialState: GenreState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchGenres = createAsyncThunk('genres/fetchAll', async () => {
  return genreService.getAll()
})

export const createGenre = createAsyncThunk(
  'genres/create',
  async (data: { name: string }) => {
    return genreService.create(data)
  }
)

const genreSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch genres'
      })
      .addCase(createGenre.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  },
})

export const genreReducer = genreSlice.reducer
