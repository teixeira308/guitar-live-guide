# Data Model: Live Guitar Guide

## Entity Summary

| Entity | Collection | Key Relationships |
|---|---|---|
| User | `users` | Owns all entities via `userId` |
| Song | `songs` | Belongs to User, referenced by PlaylistSongs |
| Playlist | `playlists` | Belongs to User, contains Songs (ordered) |
| PlaylistSong | `playlistSongs` | Join table: Playlist → Song with order index |
| Session | `sessions` | Belongs to User, tracks played songs |
| SessionSong | `sessionSongs` | Join table: Session → Song with status |
| Genre | `genres` | Predefined, referenced by Song (up to 2) |
| Sentiment | `sentiments` | Predefined, referenced by Song |

---

## Song

Central entity — a musical piece with metadata and YouTube links.

```typescript
interface Song {
  id: string;                    // crypto.randomUUID()
  userId: string;                // auth.currentUser.uid
  workspaceId?: string;
  name: string;                  // Song title
  artist: string;                // Artist/band name
  youtubeOriginalUrl: string;    // YouTube URL for original song
  youtubeLessonUrl: string;      // YouTube URL for lesson/ tutorial
  youtubeBackingTrackUrl: string; // YouTube URL for backing track
  youtubeImprovisationTrackUrl: string; // YouTube URL for improvisation backing track
  duration: number;              // Duration in seconds
  bpm: number;                   // Beats per minute
  key: string;                   // Musical key (e.g., "E", "Gm", "C#")
  capo: number;                  // Capo fret position (0 = no capo)
  tuning: string;                // e.g., "Standard", "Drop D", "Open G"
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  genreIds: string[];            // Max 2 genre IDs
  sentimentId: string;           // One sentiment ID
  notes?: string;                // Optional observations
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

**Validation Rules**:
- `name` required, max 200 chars
- `artist` required, max 200 chars
- At least one YouTube URL must be provided (not empty)
- YouTube URLs must match `youtube.com/watch?v=` or `youtu.be/` pattern
- `duration` > 0, max 3600 (1 hour)
- `bpm` >= 20, <= 400
- `genreIds` must contain 1-2 valid genre IDs
- `sentimentId` must reference a valid sentiment

---

## Playlist

An ordered, named collection of songs for a specific event or category.

```typescript
interface Playlist {
  id: string;
  userId: string;
  workspaceId?: string;
  name: string;                  // e.g., "Wedding", "Barzinho", "Rock Nacional"
  description?: string;
  songCount: number;             // Denormalized count
  createdAt: string;
  updatedAt: string;
}
```

**Validation Rules**:
- `name` required, max 100 chars
- `songCount` auto-calculated from PlaylistSong entries

---

## PlaylistSong

Join entity linking Playlist to Song with ordering.

```typescript
interface PlaylistSong {
  id: string;                    // composite: `${playlistId}_${songId}`
  playlistId: string;            // FK → Playlist.id
  songId: string;                // FK → Song.id
  sortOrder: number;             // Ordering index (0-based)
  createdAt: string;
}
```

**Validation Rules**:
- `sortOrder` must be unique within a playlist
- Insert/delete shifts subsequent `sortOrder` values

---

## Session

A live playing session with timer and statistics.

```typescript
interface Session {
  id: string;
  userId: string;
  workspaceId?: string;
  playlistId: string;            // The playlist being played
  status: 'active' | 'paused' | 'completed';
  startedAt: string;             // ISO 8601
  pausedAt?: string;             // ISO 8601 (when paused)
  resumedAt?: string;            // ISO 8601 (when resumed)
  endedAt?: string;              // ISO 8601 (when completed)
  elapsedSeconds: number;        // Total elapsed time in seconds
  songsPlayed: number;           // Denormalized count
  averageTimePerSong: number;    // seconds
  estimatedRemainingMinutes: number;
  createdAt: string;
  updatedAt: string;
}
```

**State Transitions**:
```
created → active → paused → active → ... → completed
```

---

## SessionSong

Tracks per-song status within a session.

```typescript
interface SessionSong {
  id: string;                    // composite: `${sessionId}_${songId}`
  sessionId: string;             // FK → Session.id
  songId: string;                // FK → Song.id
  status: 'pending' | 'playing' | 'played';
  playedAt?: string;             // ISO 8601
  durationSeconds?: number;      // Actual time spent on this song
  createdAt: string;
}
```

**Validation Rules**:
- A session can have only one `playing` song at a time
- Transition: `pending → playing → played` (no backwards)

---

## Genre

Predefined classification tag. Seeded data, not user-created in v1.

```typescript
interface Genre {
  id: string;
  name: string;                  // e.g., "Rock", "Pop Punk", "Blues"
  displayOrder: number;          // For UI ordering
}
```

**Seed Genres**:
Rock, Pop Punk, Metalcore, Hard Rock, Blues, Funk, Jazz, Country,
Reggae, Samba, MPB, Soul, R&B, Indie, Alternative, Metal, Punk,
Folk, Electronic, Acoustic, Classical, Gospel, Worship

---

## Sentiment

Predefined emotional/energy classification. Seeded data, not user-created.

```typescript
interface Sentiment {
  id: string;
  name: string;                  // e.g., "Animada", "Pesada", "Melancólica"
  energyLevel: number;           // 1-10 for smart suggestions
  displayOrder: number;
}
```

**Seed Sentiments**:
Animada (energy 8), Pesada (7), Melancólica (3), Reflexiva (3),
Feliz (9), Épica (8), Relaxante (2), Romântica (4), Triste (2),
Explosiva (9), Groove (6), Nostálgica (4), Agressiva (8),
Suave (3), Intensa (7)
