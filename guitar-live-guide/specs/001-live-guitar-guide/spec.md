# Feature Specification: Live Guitar Guide

**Feature Branch**: `001-live-guitar-guide`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "quero um promtp pra por no opencode, quero criar um site que sirva de guia pra guitarristas em live poderem ir soltando as msuicas com links do youtube e ir tocando ao vivo, eu quero criar algo que seja facil da pessoa ir criando as msuicas com link de video aula, a musica original e a guitar backing track. O site tem que ser um guia pro guitarrista treinar a live e conseguir mudando o repertorio de maneira facil, tipo em 3 lanes, 1 com a playlista, 2 com o video backing track e a 3 com possiveis caminhos que pode ir. quero que seja feita uma sessao que o guitarrista saiba se ja foi tocada ou nao na sessao, contar o tempo da sessao e quando tiver um novo acesso é pra perguntar se vai voltar a sessao que parou ou se vai comecar uma nova. cada musica pode colocar 2 generos e um sentimento da musica e o sentimento que ela traz no meio da playlist."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 3-Lane Live Session (Priority: P1)

A guitarist preparing for a live performance opens the app and sees their playlist on the left, a video player in the center, and smart suggestions on the right. They can play through songs, mark them as played, and easily navigate the repertoire without ever leaving the app.

**Why this priority**: The 3-lane layout with session tracking is the core value proposition — without it, the app is just a song list. This is the MVP.

**Independent Test**: Can be fully tested by creating 3+ songs with YouTube links, opening the app, clicking through songs in a session, and verifying the video player loads each song's backing track while the playlist updates played/pending status.

**Acceptance Scenarios**:

1. **Given** a guitarist has a playlist with 3 songs, **When** they click on a song, **Then** the video player loads the backing track, the song is highlighted in the playlist lane, and the suggestions lane updates with recommended next songs.
2. **Given** an active session, **When** the guitarist finishes playing a song and marks it as played, **Then** the song shows a "played" visual state, the session timer continues running, and the song count increments.
3. **Given** the guitarist navigates between songs, **When** they click a new song, **Then** the player switches to the new song's video source immediately without opening a new tab.

---

### User Story 2 - Song & Repertoire Management (Priority: P1)

A guitarist wants to build their repertoire by adding songs with YouTube links for the original, a lesson video, and a backing track. Each song can be tagged with up to 2 genres and a sentiment to help with smart suggestions later.

**Why this priority**: The app has no value without songs. Song creation must be simple and fast so the guitarist can set up their repertoire in minutes.

**Independent Test**: Can be fully tested by adding a new song with all 3 YouTube links, 2 genres, and a sentiment, then verifying it appears in the playlist with the correct information.

**Acceptance Scenarios**:

1. **Given** the guitarist is on the song creation screen, **When** they fill in the song name, artist, paste YouTube links for original/lesson/backing track, select 2 genres and a sentiment, **Then** the song is saved and immediately appears in the playlist.
2. **Given** a song already exists in the repertoire, **When** the guitarist edits it, **Then** changes are saved and reflected in the playlist.
3. **Given** the guitarist wants to remove a song, **When** they delete it, **Then** it is removed from all playlists and sessions.

---

### User Story 3 - Session Persistence & Resume (Priority: P2)

A guitarist was in the middle of a rehearsal session yesterday and closes the app. When they return today, the app asks if they want to continue the previous session or start a new one.

**Why this priority**: Session persistence prevents losing progress and makes the app feel professional. It is critical for recurring use but not required for a first test.

**Independent Test**: Can be fully tested by starting a session, marking 2 songs as played, closing the app, reopening it, and verifying the resume prompt appears with the correct session state.

**Acceptance Scenarios**:

1. **Given** a previous session exists with 2 played songs and a timer running, **When** the guitarist opens the app, **Then** they are prompted: "Continue last session?" with options to resume or start fresh.
2. **Given** the guitarist chooses to resume, **When** they confirm, **Then** the session restores: played songs show as played, the timer shows the elapsed time, and the playlist scrolls to where they left off.
3. **Given** the guitarist chooses to start a new session, **When** they confirm, **Then** all songs are reset to "not played," the timer resets to zero, and a fresh session begins.

---

### User Story 4 - Smart Next-Song Suggestions (Priority: P2)

After finishing a song, the right lane automatically suggests which song to play next based on the current song's artist, genres, sentiment, and energy level.

**Why this priority**: Smart suggestions reduce decision fatigue during a live performance and help guitarists build better setlists.

**Independent Test**: Can be fully tested by creating songs from the same artist and different artists, with matching genres/sentiments, playing a song, and verifying suggestions appear ranked by relevance.

**Acceptance Scenarios**:

1. **Given** a session is active and a song is marked as played, **When** the system generates suggestions, **Then** the right lane shows the top 5 recommended next songs with their name, artist, and a brief reason (e.g., "Same artist," "Same genre").
2. **Given** multiple songs match from different categories, **When** suggestions are ranked, **Then** same-artist songs appear first, followed by same-genre songs, then same-sentiment songs.
3. **Given** the guitarist dislikes a suggestion, **When** they manually pick a different song from the playlist, **Then** the suggestions update based on their actual choice.

---

### User Story 5 - Repertoire Organization (Priority: P3)

A guitarist plays at different types of events (weddings, bars, church) and wants to organize songs into separate playlists or categories.

**Why this priority**: Organization adds value for power users but the core loop of playing through a list works without it.

**Independent Test**: Can be fully tested by creating two playlists with different songs, switching between them, and verifying each playlist maintains its own played/pending state.

**Acceptance Scenarios**:

1. **Given** the guitarist has multiple playlists, **When** they select a different playlist, **Then** the playlist lane updates to show only the songs in that playlist.
2. **Given** the guitarist is reorganizing a playlist, **When** they drag a song to a new position, **Then** the order updates and persists.

---

### Edge Cases

- What happens when a YouTube link is invalid or the video is removed/private? The app should show a clear error in the video player lane and allow the guitarist to edit the link.
- What happens when the session timer reaches 24+ hours? The timer should display in days+hours format gracefully.
- What happens if the guitarist tries to start a session with an empty playlist? The app should show a friendly message prompting them to add songs first.
- What happens if two songs have the same YouTube link? The app should still work — each song is independent; duplicates are allowed.
- What happens if the app loses internet connectivity in the middle of a session? The playlist, timer, and session state should remain functional; only the video player will show an offline error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a 3-lane layout: playlist (left), video player (center), smart suggestions (right).
- **FR-002**: Users MUST be able to create songs with: name, artist, YouTube links for original, lesson video, and backing track (3 separate links), duration, BPM, key, difficulty level, up to 2 genres, and a sentiment/feeling.
- **FR-003**: Users MUST be able to edit and delete any existing song.
- **FR-004**: System MUST support starting a live session with a selected playlist.
- **FR-005**: During a session, each song MUST display a visual status: "not played," "playing," or "played."
- **FR-006**: System MUST show a running session timer (hours:minutes:seconds format).
- **FR-007**: System MUST count total songs played in the current session.
- **FR-008**: When the app is reopened with an active session, the user MUST be prompted: "Continue last session?" with options to resume or start a new session.
- **FR-009**: Resuming a session MUST restore: played song statuses, elapsed timer, and current playlist position.
- **FR-010**: Starting a new session MUST reset all statuses, timer, and statistics.
- **FR-011**: The video player lane MUST allow toggling between 3 video sources: original, lesson video, and backing track.
- **FR-012**: All video playback MUST happen within the app — no new tabs or popups.
- **FR-013**: After a song is marked as played, the suggestions lane MUST show recommended next songs ranked by: same artist first, then same genres, then same sentiment.
- **FR-014**: Users MUST be able to manually select any song from the playlist regardless of suggestions.
- **FR-015**: Users MUST be able to search the playlist by song name, artist, genre, or sentiment.
- **FR-016**: Users MUST be able to reorder songs in the playlist via drag-and-drop.
- **FR-017**: Users MUST be able to create and manage multiple playlists/repertoires.
- **FR-018**: System MUST persist all data (songs, playlists, session state) so no progress is lost when the app is closed.
- **FR-019**: Song data MUST include: name, artist, YouTube original URL, YouTube lesson URL, YouTube backing track URL, duration, BPM, key/tone, capo position, tuning, difficulty level, up to 2 genres, sentiment/feeling, and optional notes.
- **FR-020**: System MUST show session statistics: elapsed time, songs played, average time per song, and estimated remaining time.

### Key Entities *(include if feature involves data)*

- **Song**: A musical piece with metadata (name, artist, YouTube links, BPM, key, difficulty, capo, tuning, genres, sentiment, notes). Belongs to playlists and tracks played/pending status per session.
- **Playlist**: An ordered collection of songs, named and organized by event type, category, or user preference (e.g., "Wedding," "Bar," "Rock Nacional"). Reorderable.
- **Session**: A live playing session with timer, played/pending tracking per song, and statistics (elapsed time, songs played, average time per song). Can be paused, resumed, or reset.
- **Genre**: Classification tag for a song (e.g., Rock, Pop Punk, Metalcore, Blues, Funk, Jazz). Maximum 2 per song.
- **Sentiment**: Emotional/energy classification tag for a song (e.g., Animada, Pesada, Melancólica, Épica, Relaxante, Groove). Used for smart suggestions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A guitarist with 20 songs in their playlist can start a session, play through 5 songs marking each as played, in under 3 minutes of interaction time (excluding actual playing time).
- **SC-002**: After closing and reopening the app, a session with 3 played songs is restored in under 2 seconds with all state intact.
- **SC-003**: A new song can be added to the repertoire with all fields filled in under 60 seconds.
- **SC-004**: Smart suggestions show at least 2 relevant recommendations for a playlist of 10+ songs with varied artists and genres.
- **SC-005**: A guitarist can switch between the 3 video sources (original/lesson/backing track) for any song and the player responds in under 1 second per switch.
- **SC-006**: The 3-lane layout renders correctly and is fully usable on desktop (1024px+), tablet (768px+), and mobile (<768px) viewports.

## Assumptions

- Users have a stable internet connection for video playback; offline mode preserves playlist and session state but YouTube videos require connectivity.
- Users have their own YouTube links for each song (original, lesson, backing track) and are responsible for their availability.
- The app is single-user initially — no multi-user accounts or sharing features in v1.
- Genres and sentiments are predefined lists the user selects from, not free-text fields.
- Smart suggestions are rule-based (artist > genre > sentiment) rather than AI-driven in v1.
- A "session" is a single contiguous playing period — pausing the timer is not required for v1 (the timer simply runs while the session is active).
- Song duration is manually entered by the user during song creation.
