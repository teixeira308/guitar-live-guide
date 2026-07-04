import { useState, useEffect } from 'react'
import { IonSearchbar } from '@ionic/react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchSongs } from '../store/songsSlice'

interface SongSearchBarProps {
  onFilter: (filteredIds: string[]) => void
}

export const SongSearchBar = ({ onFilter }: SongSearchBarProps) => {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.songs)
  const [query, setQuery] = useState('')

  useEffect(() => {
    dispatch(fetchSongs())
  }, [dispatch])

  useEffect(() => {
    if (!query.trim()) {
      onFilter(items.map((s) => s.id))
      return
    }
    const lower = query.toLowerCase()
    const filtered = items.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.artist.toLowerCase().includes(lower)
    )
    onFilter(filtered.map((s) => s.id))
  }, [query, items, onFilter])

  return (
    <IonSearchbar
      value={query}
      onIonInput={(e) => setQuery(String(e.detail.value))}
      placeholder="Search songs or artists..."
      animated
    />
  )
}
