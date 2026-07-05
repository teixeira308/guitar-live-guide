import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { IonItem, IonInput, IonIcon, IonText } from '@ionic/react'
import { add } from 'ionicons/icons'
import type { Genre } from '../models/genre'

interface Props {
  genres: Genre[]
  value: string
  onChange: (genreId: string) => void
  onCreateNew?: (name: string) => Promise<Genre | undefined>
}

export const GenreCombobox = ({ genres, value, onChange, onCreateNew }: Props) => {
  const selected = useMemo(() => genres.find((g) => g.id === value), [genres, value])
  const [inputValue, setInputValue] = useState(selected?.name || '')
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const inputRef = useRef<HTMLIonInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(selected?.name || '')
  }, [selected])

  const filtered = useMemo(() => {
    if (!inputValue.trim()) return genres
    const lower = inputValue.toLowerCase()
    return genres.filter((g) => g.name.toLowerCase().includes(lower))
  }, [genres, inputValue])

  const handleSelect = (genre: Genre) => {
    setInputValue(genre.name)
    onChange(genre.id)
    setShowDropdown(false)
  }

  const handleInput = (val: string) => {
    setInputValue(val)
    setShowDropdown(true)
    setHighlightIdx(-1)
    if (!val.trim()) {
      onChange('')
    } else {
      const exact = genres.find((g) => g.name.toLowerCase() === val.trim().toLowerCase())
      if (exact) {
        onChange(exact.id)
      } else {
        onChange('')
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filtered.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault()
      handleSelect(filtered[highlightIdx])
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const handleBlur = useCallback(() => {
    setTimeout(() => setShowDropdown(false), 200)
  }, [])

  const handleCreateNew = async () => {
    if (!onCreateNew || !inputValue.trim()) return
    const newGenre = await onCreateNew(inputValue.trim())
    if (newGenre) {
      setInputValue(newGenre.name)
      onChange(newGenre.id)
    }
    setShowDropdown(false)
  }

  const showCreateOption = inputValue.trim() && !genres.some(
    (g) => g.name.toLowerCase() === inputValue.trim().toLowerCase()
  )

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <IonItem>
        <IonInput
          ref={inputRef}
          label="Gênero (opcional)"
          labelPlacement="floating"
          value={inputValue}
          onIonInput={(e) => handleInput(String(e.detail.value))}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </IonItem>
      {showDropdown && (filtered.length > 0 || showCreateOption) && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'var(--ion-item-background, #000007)',
            border: '1px solid var(--ion-border-color, #1e1e2f)',
            borderRadius: 8,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {filtered.map((genre, idx) => (
            <div
              key={genre.id}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                background: idx === highlightIdx ? 'rgba(249, 196, 27, 0.15)' : 'transparent',
                color: value === genre.id ? 'var(--ion-color-primary, #f9c41b)' : undefined,
              }}
              onMouseDown={() => handleSelect(genre)}
              onMouseEnter={() => setHighlightIdx(idx)}
            >
              {genre.name}
            </div>
          ))}
          {showCreateOption && (
            <div
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderTop: '1px solid var(--ion-border-color, #1e1e2f)',
                color: 'var(--ion-color-primary, #f9c41b)',
              }}
              onMouseDown={handleCreateNew}
            >
              <IonIcon icon={add} style={{ fontSize: 16 }} />
              <IonText style={{ fontSize: '0.85rem' }}>
                Criar &quot;{inputValue.trim()}&quot;
              </IonText>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
