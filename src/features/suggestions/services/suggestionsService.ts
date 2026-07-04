import type { Song } from '../../../shared/models/song'
import type { SessionSong } from '../../../shared/models/sessionSong'

interface Suggestion {
  song: Song
  reason: string
  score: number
}

export const suggestionsService = {
  getSuggestions(
    currentSong: Song,
    allSongs: Song[],
    sessionSongs: SessionSong[]
  ): Suggestion[] {
    const playedIds = new Set(
      sessionSongs.filter((s) => s.status === 'played').map((s) => s.songId)
    )

    const scored = allSongs
      .filter((s) => s.id !== currentSong.id && !playedIds.has(s.id))
      .map((song) => {
        let score = 0
        let reason = ''

        if (song.artist === currentSong.artist) {
          score += 3
          reason = 'Mesmo artista'
        }

        const sharedGenres = song.genreIds.filter((g) =>
          currentSong.genreIds.includes(g)
        ).length
        if (sharedGenres > 0) {
          score += sharedGenres * 2
          if (!reason) reason = 'Mesmo gênero'
        }

        if (song.sentimentId === currentSong.sentimentId) {
          score += 1
          if (!reason) reason = 'Mesmo sentimento'
        }

        if (!reason) {
          reason = 'No seu repertório'
        }

        return { song, reason, score }
      })

    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, 5)
  },
}
