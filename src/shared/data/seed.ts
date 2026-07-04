import type { Genre } from '../models/genre'
import type { Sentiment } from '../models/sentiment'

export const SEED_GENRES: Genre[] = [
  { id: 'genre-rock', name: 'Rock', displayOrder: 1 },
  { id: 'genre-pop-punk', name: 'Pop Punk', displayOrder: 2 },
  { id: 'genre-metalcore', name: 'Metalcore', displayOrder: 3 },
  { id: 'genre-hard-rock', name: 'Hard Rock', displayOrder: 4 },
  { id: 'genre-blues', name: 'Blues', displayOrder: 5 },
  { id: 'genre-funk', name: 'Funk', displayOrder: 6 },
  { id: 'genre-jazz', name: 'Jazz', displayOrder: 7 },
  { id: 'genre-country', name: 'Country', displayOrder: 8 },
  { id: 'genre-reggae', name: 'Reggae', displayOrder: 9 },
  { id: 'genre-samba', name: 'Samba', displayOrder: 10 },
  { id: 'genre-mpb', name: 'MPB', displayOrder: 11 },
  { id: 'genre-soul', name: 'Soul', displayOrder: 12 },
  { id: 'genre-indie', name: 'Indie', displayOrder: 13 },
  { id: 'genre-alternative', name: 'Alternative', displayOrder: 14 },
  { id: 'genre-metal', name: 'Metal', displayOrder: 15 },
  { id: 'genre-punk', name: 'Punk', displayOrder: 16 },
  { id: 'genre-folk', name: 'Folk', displayOrder: 17 },
  { id: 'genre-acoustic', name: 'Acoustic', displayOrder: 18 },
  { id: 'genre-classical', name: 'Classical', displayOrder: 19 },
  { id: 'genre-gospel', name: 'Gospel', displayOrder: 20 },
  { id: 'genre-worship', name: 'Worship', displayOrder: 21 },
]

export const SEED_SENTIMENTS: Sentiment[] = [
  { id: 'sent-animada', name: 'Animada', energyLevel: 8, displayOrder: 1 },
  { id: 'sent-pesada', name: 'Pesada', energyLevel: 7, displayOrder: 2 },
  { id: 'sent-melancolica', name: 'Melancólica', energyLevel: 3, displayOrder: 3 },
  { id: 'sent-reflexiva', name: 'Reflexiva', energyLevel: 3, displayOrder: 4 },
  { id: 'sent-feliz', name: 'Feliz', energyLevel: 9, displayOrder: 5 },
  { id: 'sent-epica', name: 'Épica', energyLevel: 8, displayOrder: 6 },
  { id: 'sent-relaxante', name: 'Relaxante', energyLevel: 2, displayOrder: 7 },
  { id: 'sent-romantica', name: 'Romântica', energyLevel: 4, displayOrder: 8 },
  { id: 'sent-triste', name: 'Triste', energyLevel: 2, displayOrder: 9 },
  { id: 'sent-explosiva', name: 'Explosiva', energyLevel: 9, displayOrder: 10 },
  { id: 'sent-groove', name: 'Groove', energyLevel: 6, displayOrder: 11 },
  { id: 'sent-nostalgica', name: 'Nostálgica', energyLevel: 4, displayOrder: 12 },
  { id: 'sent-agressiva', name: 'Agressiva', energyLevel: 8, displayOrder: 13 },
  { id: 'sent-suave', name: 'Suave', energyLevel: 3, displayOrder: 14 },
  { id: 'sent-intensa', name: 'Intensa', energyLevel: 7, displayOrder: 15 },
]
