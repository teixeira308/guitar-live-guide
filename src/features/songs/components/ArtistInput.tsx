import { useMemo, useRef, useState } from 'react'
import { IonItem, IonInput, IonList, IonLabel } from '@ionic/react'

interface ArtistInputProps {
  value: string
  onValueChange: (value: string) => void
  existingArtists: string[]
  required?: boolean
}

function normalize(name: string) {
  return name.trim().toLowerCase()
}

function getUniqueArtists(artists: string[]) {
  const map = new Map<string, { display: string; count: number }>()
  for (const a of artists) {
    const key = normalize(a)
    if (!a.trim()) continue
    if (map.has(key)) {
      map.get(key)!.count++
      if (map.get(key)!.display !== a) {
        const existing = map.get(key)!
        const lower = a.toLowerCase()
        const existingLower = existing.display.toLowerCase()
        if (lower === existingLower && a !== existing.display) {
          const aCaps = a.split('').filter((c) => c >= 'A' && c <= 'Z').length
          const existingCaps = existing.display.split('').filter((c) => c >= 'A' && c <= 'Z').length
          if (aCaps > existingCaps) {
            existing.display = a
          }
        }
      }
    } else {
      map.set(key, { display: a, count: 1 })
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .map((a) => a.display)
}

export const ArtistInput = ({ value, onValueChange, existingArtists, required = true }: ArtistInputProps) => {
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  const uniqueArtists = useMemo(() => getUniqueArtists(existingArtists), [existingArtists])

  const suggestions = useMemo(() => {
    if (!draft.trim() || draft === value) return []
    const lower = draft.toLowerCase()
    return uniqueArtists.filter((a) => a.toLowerCase().includes(lower))
  }, [draft, uniqueArtists, value])

  const handleSelect = (artist: string) => {
    setDraft(artist)
    onValueChange(artist)
    setFocused(false)
  }

  const handleBlur = () => {
    setTimeout(() => setFocused(false), 200)
    if (draft !== value) {
      onValueChange(draft)
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <IonItem>
        <IonInput
          label={required ? 'Artista *' : 'Artista (opcional)'}
          labelPlacement="floating"
          value={draft}
          onIonInput={(e) => setDraft(String(e.detail.value))}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          required={required}
        />
      </IonItem>
      {focused && suggestions.length > 0 && (
        <IonList
          inset
          style={{
            position: 'absolute',
            top: '100%',
            left: 12,
            right: 12,
            zIndex: 1000,
            maxHeight: 200,
            overflowY: 'auto',
            margin: 0,
            border: '1px solid var(--ion-border-color, #1e1e2f)',
            borderRadius: 8,
          }}
        >
          {suggestions.slice(0, 8).map((artist) => (
            <IonItem
              key={artist}
              button
              onClick={() => handleSelect(artist)}
              style={{ '--min-height': '36px' } as React.CSSProperties}
            >
              <IonLabel style={{ fontSize: '0.9rem' }}>{artist}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  )
}
