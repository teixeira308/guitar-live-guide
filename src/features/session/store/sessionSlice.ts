import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sessionService } from '../services/sessionService'
import type { Session } from '../../../shared/models/session'
import type { SessionSong } from '../../../shared/models/sessionSong'

interface SessionState {
  activeSession: Session | null
  sessionSongs: SessionSong[]
  elapsedSeconds: number
  loading: boolean
  error: string | null
}

const initialState: SessionState = {
  activeSession: null,
  sessionSongs: [],
  elapsedSeconds: 0,
  loading: false,
  error: null,
}

export const startSession = createAsyncThunk(
  'session/start',
  async (playlistId?: string) => {
    return sessionService.start(playlistId)
  }
)

export const resumeSession = createAsyncThunk(
  'session/resume',
  async (sessionId: string) => {
    const session = await sessionService.resume(sessionId)
    const songs = session ? await sessionService.getSessionSongs(sessionId) : []
    return { session, songs }
  }
)

export const checkActiveSession = createAsyncThunk(
  'session/checkActive',
  async () => {
    return sessionService.getActive()
  }
)

export const markSongPlaying = createAsyncThunk(
  'session/markPlaying',
  async ({ sessionId, songId }: { sessionId: string; songId: string }) => {
    return sessionService.markPlaying(sessionId, songId)
  }
)

export const markSongPlayed = createAsyncThunk(
  'session/markPlayed',
  async ({ sessionId, songId }: { sessionId: string; songId: string }) => {
    await sessionService.markPlayed(sessionId, songId)
    return { sessionId, songId }
  }
)

export const endSession = createAsyncThunk(
  'session/end',
  async (sessionId: string) => {
    await sessionService.end(sessionId)
  }
)

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    tickTimer(state) {
      state.elapsedSeconds += 1
    },
    resetSession() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.fulfilled, (state, action) => {
        state.activeSession = action.payload
        state.sessionSongs = []
        state.elapsedSeconds = 0
      })
      .addCase(checkActiveSession.fulfilled, (state, action) => {
        state.activeSession = action.payload
      })
      .addCase(resumeSession.fulfilled, (state, action) => {
        state.activeSession = action.payload.session
        state.sessionSongs = action.payload.songs
      })
      .addCase(markSongPlaying.fulfilled, (state, action) => {
        state.sessionSongs = state.sessionSongs.filter(
          (s) => s.status !== 'playing'
        )
        state.sessionSongs.push(action.payload)
      })
      .addCase(markSongPlayed.fulfilled, (state, action) => {
        const idx = state.sessionSongs.findIndex(
          (s) => s.songId === action.payload.songId
        )
        if (idx !== -1) {
          state.sessionSongs[idx].status = 'played'
        }
      })
      .addCase(endSession.fulfilled, (state) => {
        state.activeSession = null
        state.sessionSongs = []
      })
  },
})

export const { tickTimer, resetSession } = sessionSlice.actions
export const sessionReducer = sessionSlice.reducer
