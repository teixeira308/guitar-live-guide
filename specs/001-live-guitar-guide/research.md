# Research: Live Guitar Guide

## Decisions

### State Management: Redux Toolkit
- **Decision**: Redux Toolkit with `createAsyncThunk` and slices
- **Rationale**: Constitution-mandated (Principle IV). `createAsyncThunk`
  handles pending/fulfilled/rejected states automatically, which maps directly
  to the spec's session state needs (loading, error, lastFetched).
- **Alternatives considered**: Zustand (rejected by constitution), plain React
  Context (insufficient for complex async state across 5+ features)

### Persistence: Firebase Firestore + IndexedDB Cache
- **Decision**: Firebase Firestore as primary persistence, IndexedDB via `idb`
  as offline cache
- **Rationale**: Constitution-mandated (Principle II). Firestore provides
  real-time sync, auth integration, and cloud backup. IndexedDB cache ensures
  session continuity during network loss.
- **Alternatives considered**: Local-only IndexedDB (no cloud sync for future
  multi-device), REST API + SQLite (overkill for client-only PWA)

### Architecture: 3-Layer (Repository → Service → Slice)
- **Decision**: Strict layering with no cross-layer shortcuts
- **Rationale**: Constitution-mandated (Principle IV, non-negotiable).
  Enforces testability — each layer can be tested independently.
- **Alternatives considered**: Direct Firebase calls from components
  (prohibited), service-only pattern (less testable state management)

### Video Player Strategy
- **Decision**: React Player for YouTube embeds
- **Rationale**: Constitution-mandated. Handles YouTube iframe API, provides
  unified API for play/pause/seek, works with React lifecycle.
- **Alternatives considered**: YouTube IFrame API directly (more boilerplate),
  custom wrapper (reinventing the wheel)

### Auth: Firebase Auth with Email/Password
- **Decision**: Firebase Auth with email/password authentication
- **Rationale**: Constitution-mandated. Simplest setup for single-user v1.
  `onAuthStateChanged` provides session lifecycle tracking.
- **Alternatives considered**: Anonymous auth (no user data isolation),
  OAuth providers (overhead for v1 single-user)

### Layout: CSS Grid 3-Column
- **Decision**: CSS Grid with TailwindCSS responsive breakpoints
- **Rationale**: Constitution-mandated responsive behavior (3 cols ≥1024px,
  2 cols ≥768px, 1 col <768px). Tailwind's grid utilities handle this
  declaratively with `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.

### Smart Suggestions Algorithm
- **Decision**: Rule-based scoring (artist > genre > sentiment)
- **Rationale**: Spec assumptions state no AI in v1. Priority: same artist
  (+3), same genre (+2 per matching genre), same sentiment (+1). Top 5
  suggestions displayed.
- **Alternatives considered**: AI/LLM-based (out of scope), random selection
  (too unpredictable for live use), manual fixed order (defeats purpose)

### Song ID Generation
- **Decision**: `crypto.randomUUID()` for all entity IDs
- **Rationale**: Constitution-mandated. Provides collision-free IDs without
  server coordination.

### Testing Strategy
- **Decision**: Vitest for unit/integration, React Testing Library for
  components, `@firebase/rules-unit-testing` for Firestore rules
- **Rationale**: Vitest integrates natively with Vite (constitution-mandated
  build tool). RTL enforces testing from user perspective.

### PWA Strategy
- **Decision**: Vite PWA plugin (vite-plugin-pwa) with service worker
- **Rationale**: Constitution-mandated PWA support (Principle V). Workbox
  integration for asset caching, NetworkFirst for Firestore API calls.
