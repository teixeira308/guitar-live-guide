# Implementation Plan: Live Guitar Guide

**Branch**: `` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-live-guitar-guide/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a PWA web application for live guitarists to manage repertoire sessions
with a 3-lane layout. Lane 1 is the playlist (songs with YouTube links, genres,
sentiments, and played/pending status). Lane 2 is the video player with toggles
between original, lesson, and backing track. Lane 3 shows smart next-song
suggestions based on artist, genre, and sentiment. Sessions track elapsed time,
song status, and statistics; they auto-persist and prompt resume on return.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode required)

**Primary Dependencies**:
- React 18+
- Redux Toolkit (`createAsyncThunk`, slices)
- Firebase (Firestore + Auth)
- React Player (YouTube embeds)
- Framer Motion
- TailwindCSS + shadcn/ui
- React Router v6+

**Storage**: Firebase Firestore (primary persistence), IndexedDB via `idb`
(offline cache)

**Testing**: Vitest + React Testing Library, `@firebase/rules-unit-testing`
for Firestore rules

**Target Platform**: Web browser (installed as PWA) — Desktop, Tablet, Mobile

**Project Type**: web-application (PWA, fully client-side)

**Performance Goals**: UI transitions <200ms (Principle I), playlist
virtualization for 100+ songs, lazy-loaded routes and video players,
session restore in <2s

**Constraints**: Offline-capable (playlist/session intact without network),
dark theme required, 3-lane layout mandatory, no backend server,
Firebase SDK isolated in repositories layer only

**Scale/Scope**: Single-user v1, song library of 50-200 songs,
session duration up to 8 hours

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|---|---|---|
| **I. Speed & Performance** | ✅ PASS | Lazy loading, virtualization, <200ms transitions all part of plan |
| **II. Cloud-First + Offline** | ✅ PASS | Firebase primary, IndexedDB cache, session persistence |
| **III. 3-Lane Musician UX** | ✅ PASS | Spec fully matches 3-lane layout, dark theme, keyboard shortcuts |
| **IV. 3-Layer Architecture** | ✅ PASS | Repositories → Services → Redux Slices enforced |
| **V. PWA & Cross-Platform** | ✅ PASS | PWA installable, responsive 3/2/1 columns |

**Complexity Justification**: None needed — all gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/001-live-guitar-guide/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── shared/
│   ├── models/            # All TypeScript interfaces
│   ├── services/
│   │   └── firebase.ts    # Firebase init + exports
│   └── components/        # Shared UI components
├── storage/
│   └── repositories/      # One per Firestore collection
├── features/
│   ├── auth/
│   │   ├── services/
│   │   ├── store/
│   │   └── screens/
│   ├── songs/
│   │   ├── services/
│   │   ├── store/
│   │   └── screens/
│   ├── playlist/
│   │   ├── services/
│   │   ├── store/
│   │   └── screens/
│   ├── session/
│   │   ├── services/
│   │   ├── store/
│   │   └── screens/
│   └── suggestions/
│       ├── services/
│       └── store/
├── App.tsx
└── main.tsx

tests/
├── firestore/
│   └── rules/
│       └── rules.test.ts
├── features/
│   ├── auth/
│   ├── songs/
│   ├── playlist/
│   ├── session/
│   └── suggestions/
```

**Structure Decision**: Web application (frontend-only PWA) with the
constitution-mandated 3-layer architecture. No backend — all Firebase SDK
calls go through the repository layer.

## Complexity Tracking

> No violations — all gates pass.
