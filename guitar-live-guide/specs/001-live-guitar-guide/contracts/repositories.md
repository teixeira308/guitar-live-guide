# Repository Contracts

Each Firestore collection has one repository in `src/storage/repositories/`.
All repositories follow these patterns defined in Constitution Principle IV.

## Pattern Reference

```typescript
// Create/Update
setDoc(doc(db, COLLECTION, entity.id), { ...entity, updatedAt: new Date().toISOString() })

// Read single — returns null if absent
getDoc(doc(db, COLLECTION, id))

// Read list with filters
query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("createdAt", "asc"))

// Partial update
updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() })

// Delete
deleteDoc(docRef)

// Real-time subscription
onSnapshot(query, callback)  // returns unsubscribe function
```

## Repository List

| Repository | Collection | Key Filters | Notes |
|---|---|---|---|
| `SongRepository` | `songs` | `userId`, genre filter | CRUD + YouTube URL validation |
| `PlaylistRepository` | `playlists` | `userId` | CRUD w/ song count management |
| `PlaylistSongRepository` | `playlistSongs` | `playlistId` reorderable | Batch operations for drag-drop reorder |
| `SessionRepository` | `sessions` | `userId`, `status` | Create/resume/complete lifecycle |
| `SessionSongRepository` | `sessionSongs` | `sessionId`, `songId` | Status transitions: pending→playing→played |
| `GenreRepository` | `genres` | None (global) | Read-only seed data |
| `SentimentRepository` | `sentiments` | None (global) | Read-only seed data |

## Auth Injection Rule

Every create operation MUST inject the current user ID:

```typescript
const userId = auth.currentUser?.uid;
if (!userId) throw new Error('User must be authenticated');
```

## Real-time Subscription Rule

Session repositories that use `onSnapshot` MUST return the unsubscribe
function so React components can clean up in `useEffect` cleanup.
