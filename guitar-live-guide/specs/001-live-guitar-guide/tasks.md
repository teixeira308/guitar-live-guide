---

description: "Task list for Live Guitar Guide feature implementation"

---

# Tasks: Live Guitar Guide

**Input**: Design documents from `specs/001-live-guitar-guide/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included where the constitution mandates them (Firestore rules, Redux slices).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- This is a frontend-only PWA web application (no backend)
- Paths follow the plan.md project structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and build configuration

- [x] T001 Initialize Vite + React + TypeScript project with `npm create vite@latest` using React + TypeScript template
- [x] T002 [P] Configure TailwindCSS with PostCSS in `vite.config.ts` and `tailwind.config.js`
- [x] T003 [P] Install and configure shadcn/ui with `npx shadcn@latest init`
- [x] T004 [P] Install core dependencies: `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `framer-motion`, `react-player`, `firebase`, `idb`
- [x] T005 [P] Configure Vite chunk splitting for Firebase in `vite.config.ts` (return 'firebase' for `node_modules/firebase`)
- [x] T006 [P] Configure TypeScript strict mode in `tsconfig.json`
- [x] T007 [P] Create `src/` directory structure per plan.md (shared/, storage/repositories/, features/auth/songs/playlist/session/suggestions/)
- [x] T008 [P] Create `.env.example` with all `VITE_FIREBASE_*` variables
- [x] T009 [P] Set up ESLint + Prettier configuration
- [x] T010 [P] Install `vitest` and `@testing-library/react` for testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Create `src/shared/services/firebase.ts` with Firebase init using `VITE_FIREBASE_*` env vars, exporting `db` and `auth`
- [x] T012 [P] Create all shared models in `src/shared/models/`: `song.ts`, `playlist.ts`, `playlistSong.ts`, `session.ts`, `sessionSong.ts`, `genre.ts`, `sentiment.ts`
- [x] T013 [P] Create `src/storage/repositories/baseRepository.ts` with generic CRUD helpers following constitution patterns (setDoc, getDoc, query, updateDoc, deleteDoc, onSnapshot)
- [x] T014 [P] Create `src/storage/repositories/genreRepository.ts` with read-only `getAll()` method
- [x] T015 [P] Create `src/storage/repositories/sentimentRepository.ts` with read-only `getAll()` method
- [x] T016 [P] Create `src/features/auth/services/authService.ts` wrapping all Firebase Auth calls (signIn, createUser, signOut, onAuthStateChanged, updatePassword, updateEmail, reauthenticateWithCredential, deleteUser, sendEmailVerification)
- [x] T017 [P] Create `src/features/auth/AuthProvider.tsx` with React Context tracking `{ user, loading }` via `onAuthStateChanged`, spinner while loading, LoginScreen when unauthenticated
- [x] T018 [P] Create `src/App.tsx` with Firebase Auth bootstrap logic, React Router setup, and Redux Provider
- [x] T019 [P] Create `src/main.tsx` as entry point rendering `<App />`
- [x] T020 [P] Configure Redux store at `src/app/store.ts` with `configureStore`
- [x] T021 [P] Create `firestore.rules` with `isOwner(userId)` helper, `request.auth.uid == resource.data.userId` protection, and catch-all deny
- [x] T022 [P] Create `tests/firestore/rules/rules.test.ts` using `@firebase/rules-unit-testing`
- [x] T023 [P] Create `firebase.json` with emulator configuration
- [x] T024 [P] Install and configure PWA support with `vite-plugin-pwa` in `vite.config.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 2 — Song & Repertoire Management (Priority: P1) 🎯

**Goal**: Guitarist can create, edit, and delete songs with YouTube links, genres, and sentiments. Songs appear in the repertoire immediately.

**Independent Test**: Add a new song with all 3 YouTube links, 2 genres, 1 sentiment, then verify it appears in the song list with correct data. Edit and delete to verify full CRUD.

### Implementation for User Story 2

- [x] T025 [P] [US2] Create `src/storage/repositories/songRepository.ts` with CRUD methods filtering by `userId`
- [x] T026 [US2] Create `src/features/songs/services/songService.ts` with validation (name required, YouTube URL format, duration range, BPM range, genreIds 1-2)
- [x] T027 [US2] Create `src/features/songs/store/songsSlice.ts` with `createAsyncThunk` for fetchSongs, createSong, updateSong, deleteSong; state: `{ items, loading, error, lastFetched }`
- [x] T028 [US2] Create `src/features/songs/screens/SongListScreen.tsx` displaying all songs in a searchable/filterable list
- [x] T029 [P] [US2] Create `src/features/songs/screens/SongFormScreen.tsx` with form for name, artist, 3 YouTube URLs, duration, BPM, key, capo, tuning, difficulty, 2 genre selectors, 1 sentiment selector, optional notes
- [x] T030 [P] [US2] Create song seed data for genres and sentiments (predefined lists from data-model.md)

**Checkpoint**: Songs can be created, read, updated, and deleted. Genre and sentiment lookups work.

---

## Phase 4: User Story 1 — 3-Lane Live Session (Priority: P1) 🎯 MVP

**Goal**: Guitarist opens the 3-lane view with playlist (left), video player (center), and suggestions (right). They can click a song to play its backing track, mark songs as played, and see the timer running.

**Independent Test**: Create 3 songs, start a session, click through songs, verify video player loads, playlist highlights current song, timer runs, and song status changes to played.

### Implementation for User Story 1

- [x] T031 [P] [US1] Create `src/storage/repositories/playlistRepository.ts` with CRUD methods
- [x] T032 [P] [US1] Create `src/storage/repositories/playlistSongRepository.ts` with CRUD + batch reorder methods
- [x] T033 [P] [US1] Create `src/storage/repositories/sessionRepository.ts` with CRUD + status transition methods
- [x] T034 [P] [US1] Create `src/storage/repositories/sessionSongRepository.ts` with CRUD + status transitions (pending → playing → played)
- [x] T035 [US1] Create `src/features/playlist/services/playlistService.ts` with business logic for playlist management
- [x] T036 [US1] Create `src/features/playlist/store/playlistSlice.ts` with `createAsyncThunk` for fetchPlaylists, createPlaylist, updatePlaylist, deletePlaylist, reorderSongs
- [x] T037 [US1] Create `src/features/session/services/sessionService.ts` with session lifecycle (start, markPlaying, markPlayed, end)
- [x] T038 [US1] Create `src/features/session/store/sessionSlice.ts` with `createAsyncThunk` for startSession, markSongPlayed, markSongPlaying, endSession, timer logic
- [x] T039 [P] [US1] Create `src/shared/components/VideoPlayer.tsx` wrapping React Player with toggle between original/lesson/backing track YouTube URLs
- [x] T040 [P] [US1] Create `src/shared/components/SessionTimer.tsx` displaying elapsed time in HH:MM:SS format
- [x] T041 [US1] Create `src/features/session/screens/LiveSessionScreen.tsx` — the main 3-lane layout:
  - Lane 1 (left): playlist with songs showing name, artist, played/pending/playing status
  - Lane 2 (center): VideoPlayer with source toggle buttons (original/lesson/backing track)
  - Lane 3 (right): empty placeholder for suggestions (US4 will fill)
- [x] T042 [US1] Create responsive CSS grid layout in `LiveSessionScreen.tsx`: 3 cols >=1024px, 2 cols >=768px, 1 col <768px
- [x] T043 [US1] Implement keyboard shortcuts: Space (play/pause), arrows (next/previous song), Ctrl+Enter (mark played)
- [x] T044 [US1] Integrate dark theme via TailwindCSS `darkMode` class on `<html>` element

**Checkpoint**: Full 3-lane session works. Songs play, timer runs, statuses update. MVP is functional.

---

## Phase 5: User Story 3 — Session Persistence & Resume (Priority: P2)

**Goal**: If the guitarist closes the app mid-session, reopening prompts "Continue last session?" with resume or new session options. Resuming restores all state.

**Independent Test**: Start a session, play 2 songs, close the tab, reopen, verify the prompt appears. Choose "Continue" and confirm played songs and timer are restored. Choose "New session" and verify everything resets.

### Implementation for User Story 3

- [x] T045 [P] [US3] Create `src/features/session/services/sessionPersistenceService.ts` with logic to detect active sessions and restore state
- [x] T046 [US3] Create `src/features/session/store/sessionPersistenceSlice.ts` with `createAsyncThunk` for checkLastSession, resumeSession, discardSession
- [x] T047 [US3] Create `src/features/session/screens/SessionPromptOverlay.tsx` — modal asking "Continue last session?" with Continue / New Session buttons
- [x] T048 [US3] Wire session prompt into App.tsx: on mount, dispatch `checkLastSession` if user is authenticated; show overlay if active session exists

**Checkpoint**: Session state survives page close. Resume/restart flow works end-to-end.

---

## Phase 6: User Story 4 — Smart Next-Song Suggestions (Priority: P2)

**Goal**: After marking a song as played, the right lane shows 5 suggested next songs ranked by same artist → same genre → same sentiment.

**Independent Test**: Create 2 songs by Foo Fighters, 2 by Green Day (same genre), 2 by Paramore (different genre, same sentiment as Foo Fighters). Play a Foo Fighters song — verify Foo Fighters songs appear first, then Green Day (same genre), then Paramore (same sentiment).

### Implementation for User Story 4

- [x] T049 [P] [US4] Create `src/features/suggestions/services/suggestionsService.ts` with rule-based ranking algorithm (same artist +3, same genre +2 per match, same sentiment +1, exclude already played songs)
- [x] T050 [US4] Create `src/features/suggestions/store/suggestionsSlice.ts` with `createAsyncThunk` for fetchSuggestions(songId, sessionId)
- [x] T051 [US4] Create `src/features/suggestions/screens/SuggestionsPanel.tsx` — right lane component showing top 5 song suggestions with reason label ("Same artist", "Same genre", "Same sentiment")
- [x] T052 [US4] Integrate SuggestionsPanel into LiveSessionScreen Lane 3, updating whenever a song is marked as played or manually selected

**Checkpoint**: Right lane shows relevant suggestions that update dynamically. Manual selection updates suggestions.

---

## Phase 7: User Story 5 — Repertoire Organization (Priority: P3)

**Goal**: Guitarist can create multiple named playlists (e.g., "Wedding", "Barzinho", "Rock Nacional"), drag-drop reorder songs within them, and switch between playlists.

**Independent Test**: Create 2 playlists with different songs, drag a song to reorder, switch between playlists, verify each maintains its own order and content.

### Implementation for User Story 5

- [x] T053 [P] [US5] Create `src/features/playlist/screens/PlaylistManagerScreen.tsx` — list of all playlists with create/rename/delete
- [x] T054 [US5] Create `src/features/playlist/screens/PlaylistEditorScreen.tsx` — view songs in a playlist, drag-drop reorder, add/remove songs
- [x] T055 [US5] Implement drag-and-drop reorder in `playlistSongService.ts` batch reorder method
- [x] T056 [US5] Integrate playlist selector into `LiveSessionScreen.tsx` so guitarist can pick which playlist to use in a session

**Checkpoint**: Multiple playlists work independently. Songs can be reordered. Playlists can be selected for sessions.

---

## Phase 8: Session Statistics (Cross-Cutting)

**Purpose**: Show session statistics during and after a session

- [x] T057 Create `src/features/session/screens/SessionStatsPanel.tsx` showing: elapsed time, songs played, average time per song, estimated remaining time
- [x] T058 Integrate SessionStatsPanel into LiveSessionScreen

---

## Phase 9: Search & Filter (Cross-Cutting)

**Purpose**: Allow searching/filtering the playlist by name, artist, genre, sentiment

- [x] T059 Create `src/features/songs/screens/SongSearchBar.tsx` with text search and filter dropdowns for genre + sentiment
- [x] T060 Wire search/filter into `SongListScreen.tsx` and `LiveSessionScreen.tsx` Lane 1

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T061 [P] Add keyboard shortcut: Ctrl+F to focus search bar
- [x] T062 [P] Add keyboard shortcut: Ctrl+N to start new session
- [x] T063 [P] Handle YouTube video error state (invalid/private/removed URL) in VideoPlayer
- [x] T064 [P] Handle empty playlist state — show "Add songs to get started" message
- [x] T065 [P] Handle session timer overflow (24h+) — display in days+hours format
- [x] T066 [P] Implement offline detection: show offline message in video player, keep playlist/timer functional
- [x] T067 [P] Add Framer Motion transitions between song selections and lane updates
- [x] T068 [P] Add PWA manifest with icons, theme color, and splash screen config
- [x] T069 [P] Add Loading spinner component for async operations (shadcn/ui)
- [x] T070 [P] Run quickstart.md validation scenarios end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US2 — Song Management (Phase 3)**: Depends on Foundational completion
- **US1 — 3-Lane Session (Phase 4)**: Depends on Foundational + US2 (needs songs to play)
- **US3 — Session Persistence (Phase 5)**: Depends on US1 (needs session lifecycle)
- **US4 — Smart Suggestions (Phase 6)**: Depends on US1 + US2 (needs session + songs with genres/sentiments)
- **US5 — Repertoire Org (Phase 7)**: Depends on US2 (needs song management)
- **Statistics (Phase 8)**: Depends on US1
- **Search/Filter (Phase 9)**: Depends on US2
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US2 — Song Management (P1)**: Start after Foundational — no dependencies on other stories
- **US1 — 3-Lane Session (P1)**: Start after Foundational + US2 — depends on songs existing
- **US3 — Session Persistence (P2)**: Start after US1 — depends on session lifecycle
- **US4 — Smart Suggestions (P2)**: Start after US1 + US2 — depends on session + song metadata
- **US5 — Repertoire Org (P3)**: Start after US2 — depends on song management

### Within Each User Story

- Models before services
- Services before Redux slices
- Slices before screens
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Repositories within a story marked [P] can run in parallel
- UI components marked [P] within a story can run in parallel
- Different user stories with no dependency can run in parallel (US2 ↔ US3/US4 can partially overlap after US1)

---

## Parallel Example: User Story 1

```bash
# Launch all repositories for US1 together:
Task: "Create sessionRepository in src/storage/repositories/sessionRepository.ts"
Task: "Create sessionSongRepository in src/storage/repositories/sessionSongRepository.ts"
Task: "Create playlistRepository in src/storage/repositories/playlistRepository.ts"
Task: "Create playlistSongRepository in src/storage/repositories/playlistSongRepository.ts"

# Launch all UI components for US1 together:
Task: "Create VideoPlayer in src/shared/components/VideoPlayer.tsx"
Task: "Create SessionTimer in src/shared/components/SessionTimer.tsx"
```

## Implementation Strategy

### MVP First (US2 + US1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US2 — Song Management (needed before US1 can work)
4. Complete Phase 4: US1 — 3-Lane Live Session (core MVP)
5. **STOP and VALIDATE**: Test the full song creation + live session flow independently
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US2 (Song CRUD) → Test independently → Songs exist
3. Add US1 (3-Lane Session) → Test independently → **MVP done!**
4. Add US3 (Persistence) → Sessions survive refresh
5. Add US4 (Smart Suggestions) → Right lane has recommendations
6. Add US5 (Repertoire Org) → Multiple playlists with reorder
7. Each increment adds value without breaking previous work

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
