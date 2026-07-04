<!--
  Sync Impact Report — v1.0.0
  ============================
  Version change: template → 1.0.0
  Modified principles: N/A (first real version — all new)
    - I. Speed & Performance First
    - II. Cloud-First with Offline Resilience
    - III. Musician-Centric 3-Lane UX
    - IV. 3-Layer Clean Architecture
    - V. PWA & Cross-Platform Parity
  Added sections:
    - Core Principles (all 5)
    - Technology Stack & Constraints
    - Development Workflow & Quality Gates
    - Governance (full rules, amendment procedure, versioning policy)
  Removed sections: N/A
  Templates requiring updates:
    - ✅ .specify/templates/plan-template.md — no changes needed
    - ✅ .specify/templates/spec-template.md — no changes needed
    - ✅ .specify/templates/tasks-template.md — no changes needed
  Follow-up TODOs:
    - NONE — all placeholders filled
-->

# Guitar Live Guide Constitution

## Core Principles

### I. Speed & Performance First

Navigation MUST be instant with zero perceivable lag. The playlist MUST use
virtualization (e.g., react-window) to handle 100+ songs without degradation.
All route segments and video players MUST use lazy loading. Framer Motion
animations MUST NOT block user interaction. All UI transitions MUST complete
in under 200ms. The guitarist's focus is the priority — every millisecond of
wait time is a distraction from performance.

### II. Cloud-First with Offline Resilience

Firebase Firestore is the PRIMARY persistence layer. All user data (playlists,
sessions, settings) MUST be stored in Firestore. IndexedDB serves as an
OFFLINE cache — the app MUST remain functional (read cached data, queue
writes) when the network is unavailable. Session state, preferences, and
progress MUST be automatically persisted. On return, the user MUST be prompted
to restore their last session or start fresh. Data loss under normal
conditions is UNACCEPTABLE.

### III. Musician-Centric 3-Lane UX

The interface MUST be designed for guitarists performing live or rehearsing.
A dark theme is REQUIRED — no light theme unless explicitly added. Three
layout lanes are MANDATORY:
  - **Lane 1** (left): Playlist — songs with name, artist, duration,
    difficulty, tuning, BPM, key, genre, sentiment, and played/pending status.
  - **Lane 2** (center): Main area — embedded YouTube player for original,
    lesson video, and backing track, with quick toggle between sources.
  - **Lane 3** (right): Smart suggestions — auto-suggested next songs based
    on artist, genre, energy, sentiment, BPM, and history.

Keyboard shortcuts MUST cover all primary actions: space (play/pause),
arrows (next song), Ctrl+F (search), Ctrl+Enter (mark played), Ctrl+N (new
session). The guitarist MUST never need to leave the application or open new
tabs.

### IV. 3-Layer Clean Architecture (NON-NEGOTIABLE)

The codebase MUST follow a strict three-layer pattern with no layer skipping:

  **Layer 1 — Storage Repositories** (`src/storage/repositories/`)
  - One repository per Firestore collection.
  - CRUD methods MUST use the specified patterns:
    - Create/Update: `setDoc(doc(db, COLLECTION, entity.id), { ...entity, updatedAt })`
    - Read single: `getDoc(doc(db, COLLECTION, id))` — return `null` if absent
    - Read list: `query(collection(db, COLLECTION), where(...), orderBy(...)) + getDocs`
    - Partial update: `updateDoc(docRef, { ...data, updatedAt })`
    - Delete: `deleteDoc(docRef)`
    - Real-time: `onSnapshot(query, callback)` — return unsubscribe function
  - Every created document MUST inject `auth.currentUser?.uid` as `userId`.
    Throw if no authenticated user.

  **Layer 2 — Feature Services** (`src/features/<feature>/services/`)
  - Business logic and validation ONLY.
  - MUST NOT import `firebase/firestore` or `firebase/auth` directly.
  - MUST call repositories exclusively.

  **Layer 3 — Redux Slices** (`src/features/<feature>/store/`)
  - Each slice defines async operations via `createAsyncThunk`.
  - State shape MUST be: `{ items, loading, error, lastFetched }`.
  - Components dispatch thunks; they NEVER call services or repositories.

No React component MAY import from Firebase SDK. No `any` types without
explicit written justification. Full TypeScript strict mode REQUIRED.

### V. PWA & Cross-Platform Parity

The application MUST function as an installable Progressive Web App on
desktop, tablet, and mobile. Responsive layout is REQUIRED:
  - **Desktop** (>=1024px): 3 columns
  - **Tablet** (>=768px): 2 columns
  - **Mobile** (<768px): 1 column with tab navigation

All core functionality MUST work offline after initial load. A service worker
MUST cache assets for instant loading on repeat visits. The PWA manifest MUST
include proper icons, splash screens, and a theme color.

## Technology Stack & Constraints

The following stack is HARD CONSTRAINTS — no deviation without explicit
written approval documented in this constitution's amendment log.

| Category | Requirement |
|---|---|
| **Framework** | React 18+ with TypeScript 5+ |
| **Build** | Vite (latest) |
| **Styling** | TailwindCSS + shadcn/ui |
| **State Mgmt** | Redux Toolkit (`createAsyncThunk`, slices) |
| **Persistence** | Firebase Firestore (primary), IndexedDB via `idb` (offline cache) |
| **Auth** | Firebase Auth (mandatory) |
| **Routing** | React Router v6+ |
| **Video** | React Player (YouTube embeds) |
| **Animation** | Framer Motion |
| **Chunking** | Vite config: `if (id.includes('node_modules/firebase')) return 'firebase'` |
| **Caching** | NetworkFirst for `firestore.googleapis.com` |

### Firebase SDK Access Rules

- `firebase/firestore` MUST only be imported in `src/storage/repositories/`
- `firebase/auth` MUST only be imported in `src/shared/services/firebase.ts`
  and `src/features/auth/services/authService.ts`
- Use `import.meta.env.VITE_*` for environment variables (NOT `process.env`)
- All timestamps MUST be ISO strings: `new Date().toISOString()`
- IDs MUST be generated via `crypto.randomUUID()`

## Development Workflow & Quality Gates

### Authentication Flow

- `src/features/auth/services/authService.ts` wraps all Firebase Auth calls:
  `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`,
  `onAuthStateChanged`, `updatePassword`, `updateEmail`,
  `reauthenticateWithCredential`, `deleteUser`, `sendEmailVerification`.
- `AuthProvider.tsx` (React Context) MUST:
  - Track auth state via `onAuthStateChanged`
  - Expose `{ user, loading }`
  - Show a spinner while loading
  - Render `LoginScreen` when unauthenticated, the app when authenticated

### Data Bootstrap

- `App.tsx` MUST use a `useEffect` to dispatch bootstrap thunks when the user
  is authenticated and an active workspace is selected:
  ```
  useEffect(() => {
    if (user && activeWorkspaceId) {
      dispatch(bootstrapData1(activeWorkspaceId));
      dispatch(bootstrapData2(activeWorkspaceId));
    }
  }, [dispatch, user, activeWorkspaceId]);
  ```

### Models

- ALL interfaces MUST be centralized in `src/shared/models/`
- Every entity MUST include: `id`, `userId`, `createdAt`, `updatedAt`
- Workspace isolation via optional `workspaceId` field
- Auto-generated IDs using `crypto.randomUUID()`

### Firestore Security

- `firestore.rules` MUST include:
  - Helper function `isOwner(userId)` comparing `request.auth.uid`
  - Protection: `request.auth.uid == resource.data.userId`
  - Catch-all deny for unmatched paths
- Rules tests REQUIRED in `tests/firestore/rules/rules.test.ts` using
  `@firebase/rules-unit-testing`

### Quality Gates

- WCAG 2.1 AA minimum accessibility
- Playlist virtualization MUST be used for 100+ songs
- TypeScript strict mode MUST be enabled
- Every new feature MUST include Redux slice tests
- Firebase chunk MUST be separated in Vite config
- Lint + typecheck MUST pass before any commit
- No Firebase SDK imports outside repositories and authService
- No `any` types without written justification in PR

## Governance

This constitution is the authoritative governance document for the Guitar
Live Guide project. It supersedes all ad-hoc decisions, verbal agreements,
and informal conventions.

### Amendment Procedure

1. Proposed amendments MUST be documented in a PR or issue with rationale.
2. Changes MUST be reviewed and approved before merging.
3. The `LAST_AMENDED_DATE` MUST be updated to the date of approval.
4. The `CONSTITUTION_VERSION` MUST be bumped according to semantic rules:
   - **MAJOR**: Backward-incompatible principle removals or redefinitions.
   - **MINOR**: New principles, sections, or materially expanded guidance.
   - **PATCH**: Clarifications, wording refinements, typo fixes.
5. After amendment, a Sync Impact Report MUST be appended (as HTML comment)
   documenting version change, modified sections, and template impacts.

### Compliance Review

- Constitution compliance MUST be verified during:
  - Specification reviews (spec templates as gates)
  - Implementation plan reviews (plan templates as gates)
  - PR reviews (code must follow principles and architecture)
- Violations MUST be documented and a remediation plan created within one
  sprint cycle.

### Complexity Justification

Any deviation from the principles or architecture MUST be accompanied by:
- A clear statement of which principle/rule is being deviated from
- The specific reason the deviation is necessary
- A planned remediation timeline

**Version**: 1.0.0 | **Ratified**: 2026-06-29 | **Last Amended**: 2026-06-29
