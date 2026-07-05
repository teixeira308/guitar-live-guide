import { configureStore } from '@reduxjs/toolkit'
import { songsReducer } from '../features/songs/store/songsSlice'
import { playlistReducer } from '../features/playlist/store/playlistSlice'
import { sessionReducer } from '../features/session/store/sessionSlice'
import { suggestionsReducer } from '../features/suggestions/store/suggestionsSlice'
import { genreReducer } from '../features/genres/store/genreSlice'

export const store = configureStore({
  reducer: {
    songs: songsReducer,
    playlists: playlistReducer,
    session: sessionReducer,
    suggestions: suggestionsReducer,
    genres: genreReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
