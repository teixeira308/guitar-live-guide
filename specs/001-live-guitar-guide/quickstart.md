# Quickstart: Live Guitar Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Firebase project with Firestore and Auth enabled
- Firebase Admin SDK service account (for rules testing)

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in VITE_FIREBASE_* values from Firebase Console

# Start dev server
npm run dev
```

## Validation Scenarios

### Scenario 1: Song CRUD

1. Open the app and log in with email/password
2. Click "Add Song" — fill in name, artist, 3 YouTube links, select 2 genres
   and a sentiment
3. Verify song appears in the playlist immediately
4. Edit the song name — verify it updates in the playlist
5. Delete the song — verify it disappears from the playlist

**Expected**: Full CRUD cycle completes in under 60 seconds per song.

### Scenario 2: 3-Lane Session

1. Add 5+ songs to a playlist
2. Start a new session
3. Click a song — verify:
   - Video player loads the backing track (Lane 2)
   - Song is highlighted and shows "playing" status (Lane 1)
   - Suggestions appear in Lane 3
4. Mark as played — verify:
   - Song shows "played" status
   - Timer increments
   - Suggestions update
5. Switch video source (original → lesson → backing track) — verify player
   switches without opening new tabs

### Scenario 3: Session Persistence

1. Start a session, play 2 songs, note the timer value
2. Close the browser tab
3. Reopen the app
4. Verify the prompt: "Continue last session?"
5. Click "Continue" — verify:
   - 2 songs show as "played"
   - Timer shows the same elapsed time
   - Suggestions and playlist position are restored
6. Start a new session — verify all statuses and timer reset

### Scenario 4: Smart Suggestions

1. Create songs: 2 by Foo Fighters (same artist, rock genre), 2 by Green Day
   (pop punk genre), 2 by Paramore (rock genre, high energy sentiment)
2. Play a Foo Fighters song
3. Verify suggestions put the other Foo Fighters song first, then rock-same
   genre songs, then same-sentiment songs
4. Manually pick a Green Day song instead — verify suggestions adapt

### Scenario 5: Search & Filter

1. Create 10+ songs with varied names, artists, genres
2. Search by song name — verify matching results only
3. Search by artist — verify all songs from that artist
4. Filter by genre — verify only songs with that genre
5. Filter by sentiment — verify only songs with that sentiment

### Scenario 6: Playlist Reordering

1. Create a playlist with 5 songs
2. Drag song at position 5 to position 1
3. Verify the new order persists after page refresh

### Scenario 7: Offline Resilience

1. Start a session and play 1 song
2. Disconnect from network
3. Verify playlist and timer still work
4. Mark a song as played — verify it shows "played" (queued for sync)
5. Reconnect — verify the queued write syncs to Firestore
6. Verify the video player shows an offline message (no YouTube without
   network)

## Running Tests

```bash
# Unit + integration tests
npx vitest

# Firestore rules tests (requires Firebase emulator)
npx vitest tests/firestore/rules/

# TypeScript check
npx tsc --noEmit
```

## Key Files

| File | Purpose |
|---|---|
| `src/shared/services/firebase.ts` | Firebase init + exports |
| `src/shared/models/` | All TypeScript interfaces |
| `src/storage/repositories/` | One file per Firestore collection |
| `src/features/auth/services/authService.ts` | Firebase Auth wrapper |
| `src/features/auth/AuthProvider.tsx` | Auth state context provider |
| `firestore.rules` | Firestore security rules |
| `tests/firestore/rules/rules.test.ts` | Rules unit tests |
