# Redux Slice Contracts

Each feature defines a Redux slice with `createAsyncThunk` async operations.
All slices follow the state shape mandated by Constitution Principle IV:

```typescript
interface SliceState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;  // Date.now() timestamp
}
```

## Slice List

### Songs Slice (`features/songs/store/songsSlice.ts`)

| Thunk | Calls | Description |
|---|---|---|
| `fetchSongs` | SongService.getAll | Load all user songs |
| `createSong` | SongService.create | Create new song |
| `updateSong` | SongService.update | Update song fields |
| `deleteSong` | SongService.delete | Remove song |

State: `songsReducer` with CRUD operations on `items` array.

### Playlist Slice (`features/playlist/store/playlistSlice.ts`)

| Thunk | Calls | Description |
|---|---|---|
| `fetchPlaylists` | PlaylistService.getAll | Load all user playlists |
| `createPlaylist` | PlaylistService.create | New playlist |
| `updatePlaylist` | PlaylistService.update | Rename/reorder |
| `deletePlaylist` | PlaylistService.delete | Remove playlist |
| `reorderSongs` | PlaylistSongService.reorder | Drag-drop reorder |

State: `playlistsReducer`, `activePlaylistId` in slice state.

### Session Slice (`features/session/store/sessionSlice.ts`)

| Thunk | Calls | Description |
|---|---|---|
| `startSession` | SessionService.start | Begin new session |
| `resumeSession` | SessionService.resume | Restore last session |
| `markSongPlayed` | SessionSongService.markPlayed | Set song → played |
| `markSongPlaying` | SessionSongService.markPlaying | Set song → playing |
| `endSession` | SessionService.end | Complete session |

State: `activeSession`, `sessionSongs`, `timer`, `statistics`.

### Suggestions Slice (`features/suggestions/store/suggestionsSlice.ts`)

| Thunk | Calls | Description |
|---|---|---|
| `fetchSuggestions` | SuggestionsService.getForSong | Get top 5 recommendations |

State: `suggestions` (derived/read-only, not persisted).

### Auth Slice (`features/auth/store/authSlice.ts`)

| Thunk | Calls | Description |
|---|---|---|
| `loginUser` | AuthService.login | Email/password login |
| `registerUser` | AuthService.register | Create account |
| `logoutUser` | AuthService.logout | Sign out |

State: tracked via `AuthProvider` context; slice for async thunk states only.
