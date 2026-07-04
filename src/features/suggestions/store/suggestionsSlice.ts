import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Song } from '../../../shared/models/song'

interface SuggestionItem {
  song: Song
  reason: string
  score: number
}

interface SuggestionsState {
  items: SuggestionItem[]
}

const initialState: SuggestionsState = {
  items: [],
}

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    setSuggestions(state, action: PayloadAction<SuggestionItem[]>) {
      state.items = action.payload
    },
    clearSuggestions(state) {
      state.items = []
    },
  },
})

export const { setSuggestions, clearSuggestions } = suggestionsSlice.actions
export const suggestionsReducer = suggestionsSlice.reducer
