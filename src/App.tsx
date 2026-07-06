import { useEffect, useState, useCallback } from 'react'
import {
  IonIcon,
  IonLabel,
} from '@ionic/react'
import { home, library, list, settings } from 'ionicons/icons'
import { useAuth } from './features/auth/AuthProvider'
import { LoginScreen } from './features/auth/screens/LoginScreen'
import { DashboardScreen } from './features/auth/screens/DashboardScreen'
import { SettingsScreen } from './features/auth/screens/SettingsScreen'
import { LiveSessionScreen } from './features/session/screens/LiveSessionScreen'
import { SessionPromptOverlay } from './features/session/screens/SessionPromptOverlay'
import { PlaylistManagerScreen } from './features/playlist/screens/PlaylistManagerScreen'
import { PlaylistFormScreen } from './features/playlist/screens/PlaylistFormScreen'
import { PlaylistPickerDialog } from './features/playlist/screens/PlaylistPickerDialog'
import { PlaylistEditorScreen } from './features/playlist/screens/PlaylistEditorScreen'
import { SongLibraryScreen } from './features/songs/screens/SongLibraryScreen'
import { SongFormScreen } from './features/songs/screens/SongFormScreen'
import { useAppDispatch } from './app/hooks'
import { checkActiveSession, resetSession } from './features/session/store/sessionSlice'
import { SessionModeDialog } from './features/session/screens/SessionModeDialog'
import { useMediaQuery } from './shared/hooks/useMediaQuery'
import type { SessionMode } from './features/session/screens/SessionModeDialog'

type AppView = 'dashboard' | 'playlists' | 'session' | 'library' | 'settings'
type SubView = 'none' | 'songForm' | 'playlistEditor' | 'playlistForm'

const tabItems = [
  { key: 'dashboard', icon: home, label: 'Início' },
  { key: 'library', icon: library, label: 'Músicas' },
  { key: 'playlists', icon: list, label: 'Playlists' },
] as const

const SIDEBAR_WIDTH = 220
const BREAKPOINT = '(min-width: 768px)'

function App() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const [view, setView] = useState<AppView>('dashboard')
  const [subView, setSubView] = useState<SubView>('none')
  const [subData, setSubData] = useState<string | undefined>()
  const [showSessionPrompt, setShowSessionPrompt] = useState(false)
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false)
  const [showModePicker, setShowModePicker] = useState(false)
  const [sessionPlaylistId, setSessionPlaylistId] = useState<string | undefined>()
  const [sessionMode, setSessionMode] = useState<SessionMode>('backingTrack')
  const isDesktop = useMediaQuery(BREAKPOINT)

  useEffect(() => {
    if (user) {
      dispatch(checkActiveSession()).then((res) => {
        if (res.payload) setShowSessionPrompt(true)
      })
    }
  }, [dispatch, user])

  const handleStartSession = useCallback(() => {
    setShowPlaylistPicker(true)
  }, [])

  const handlePlaylistSelected = useCallback((playlistId?: string) => {
    setSessionPlaylistId(playlistId)
    setShowPlaylistPicker(false)
    setShowModePicker(true)
  }, [])

  const handleModeSelected = useCallback((mode: SessionMode) => {
    setSessionMode(mode)
    setShowModePicker(false)
    setView('session')
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault()
      setView('dashboard')
      setSubView('none')
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const navigate = useCallback((tab: string) => {
    setView(tab as AppView)
    setSubView('none')
  }, [])

  if (!user) {
    return <LoginScreen />
  }

  if (showSessionPrompt) {
    return (
      <SessionPromptOverlay
        onResume={() => {
          setShowSessionPrompt(false)
          setView('session')
        }}
        onNewSession={() => {
          setShowSessionPrompt(false)
          dispatch(resetSession())
        }}
      />
    )
  }

  // Full screen: session (no sidebar)
  if (view === 'session') {
    return (
      <LiveSessionScreen
        playlistId={sessionPlaylistId}
        sessionMode={sessionMode}
        onBack={() => {
          setView('dashboard')
          setSubView('none')
        }}
      />
    )
  }

  // Full screen: song form (no sidebar)
  if (subView === 'songForm') {
    return (
      <SongFormScreen
        songId={subData}
        onClose={() => {
          setSubView('none')
          setSubData(undefined)
        }}
      />
    )
  }

  // Full screen: playlist form (no sidebar)
  if (subView === 'playlistForm') {
    return (
      <PlaylistFormScreen
        playlistId={subData}
        onClose={() => {
          setSubView('none')
          setSubData(undefined)
        }}
      />
    )
  }

  // Full screen: playlist editor (no sidebar)
  if (subView === 'playlistEditor' && subData) {
    return (
      <PlaylistEditorScreen
        playlistId={subData}
        onBack={() => {
          setSubView('none')
          setSubData(undefined)
        }}
      />
    )
  }

  const isTabView = view === 'dashboard' || view === 'library' || view === 'playlists' || view === 'settings'
  if (!isTabView) return null

  const sidebarStyle: React.CSSProperties = {
    width: SIDEBAR_WIDTH,
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--ion-background-color, #000007)',
    borderRight: '1px solid var(--ion-border-color, #1e1e2f)',
    padding: 'env(safe-area-inset-top, 0px) 0 1rem',
    overflowY: 'auto',
  }

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 24px',
    cursor: 'pointer',
    background: isActive ? 'rgba(249, 196, 27, 0.1)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--ion-color-primary, #f9c41b)' : '3px solid transparent',
    color: isActive ? 'var(--ion-color-primary, #f9c41b)' : 'var(--ion-color-medium, #6b7280)',
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.15s ease',
  })

  const renderNav = (isSidebar: boolean) => (
    <>
      {tabItems.map((tab) => {
        const isActive = view === tab.key
        if (isSidebar) {
          return (
            <div
              key={tab.key}
              style={navItemStyle(isActive)}
              onClick={() => navigate(tab.key)}
            >
              <IonIcon icon={tab.icon} style={{ fontSize: 22, flexShrink: 0 }} />
              <IonLabel style={{ fontSize: 14, cursor: 'pointer' }}>{tab.label}</IonLabel>
            </div>
          )
        }
        return (
          <div
            key={tab.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              height: 56,
              minWidth: 64,
              opacity: isActive ? 1 : 0.5,
              cursor: 'pointer',
              color: isActive ? 'var(--ion-color-primary, #f9c41b)' : 'var(--ion-color-medium, #6b7280)',
            }}
            onClick={() => navigate(tab.key)}
          >
            <IonIcon icon={tab.icon} style={{ fontSize: 22 }} />
            <IonLabel style={{ fontSize: 11, cursor: 'pointer' }}>{tab.label}</IonLabel>
          </div>
        )
      })}
    </>
  )

  const mobileFooterStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: 'var(--ion-background-color)',
    borderTop: '1px solid var(--ion-border-color)',
    height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    boxSizing: 'content-box',
  }

  return (
    <>
      {isDesktop && (
        <style>{`
          main > .ion-page {
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            width: auto !important;
            height: auto !important;
            max-width: 960px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          aside nav > div:hover {
            background: rgba(249, 196, 27, 0.05) !important;
          }
        `}</style>
      )}

      <div style={{ display: 'flex', width: '100vw', minHeight: '100vh' }}>
        {isDesktop && (
          <aside style={sidebarStyle}>
            <div style={{ padding: '0 24px 1.5rem' }}>
              <img src="/logo-vazado.png" alt="Perfos" style={{ width: '100%', maxWidth: 200, display: 'block', borderRadius: 12 }} />
            </div>
            <nav style={{ flex: 1 }}>{renderNav(true)}</nav>
            <div style={{ borderTop: '1px solid var(--ion-border-color, #1e1e2f)', padding: '0.5rem 0' }}>
              <div
                style={navItemStyle(view === 'settings')}
                onClick={() => navigate('settings')}
              >
                <IonIcon icon={settings} style={{ fontSize: 22, flexShrink: 0 }} />
                <IonLabel style={{ fontSize: 14, cursor: 'pointer' }}>Ajustes</IonLabel>
              </div>
            </div>
          </aside>
        )}

        <main style={{ position: 'relative', flex: 1, minWidth: 0, paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          {view === 'dashboard' && (
            <DashboardScreen
              onStartSession={handleStartSession}
              onManagePlaylists={() => setView('playlists')}
              onSongLibrary={() => setView('library')}
            />
          )}
          {view === 'library' && (
            <SongLibraryScreen
              onBack={() => setView('dashboard')}
              onAddSong={() => {
                setSubView('songForm')
                setSubData(undefined)
              }}
              onEditSong={(songId) => {
                setSubView('songForm')
                setSubData(songId)
              }}
            />
          )}
          {view === 'playlists' && (
            <PlaylistManagerScreen
              onBack={() => setView('dashboard')}
              onEditPlaylist={(playlistId) => {
                setSubView('playlistEditor')
                setSubData(playlistId)
              }}
              onEditPlaylistMetadata={(playlistId) => {
                setSubView('playlistForm')
                setSubData(playlistId)
              }}
              onAddPlaylist={() => {
                setSubView('playlistForm')
                setSubData(undefined)
              }}
            />
          )}
          {view === 'settings' && <SettingsScreen />}
        </main>
      </div>

      {!isDesktop && (
        <>
          <style>{`
            ion-content { --padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 8px); }
          `}</style>
          <div style={mobileFooterStyle}>
            {renderNav(false)}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                height: 56,
                minWidth: 64,
                opacity: view === 'settings' ? 1 : 0.5,
                cursor: 'pointer',
                color: view === 'settings' ? 'var(--ion-color-primary, #f9c41b)' : 'var(--ion-color-medium, #6b7280)',
              }}
              onClick={() => navigate('settings')}
            >
              <IonIcon icon={settings} style={{ fontSize: 22 }} />
              <IonLabel style={{ fontSize: 11, cursor: 'pointer' }}>Ajustes</IonLabel>
            </div>
          </div>
        </>
      )}

      <PlaylistPickerDialog
        open={showPlaylistPicker}
        onSelect={handlePlaylistSelected}
        onClose={() => setShowPlaylistPicker(false)}
      />
      <SessionModeDialog
        open={showModePicker}
        onSelect={handleModeSelected}
        onClose={() => setShowPlaylistPicker(true)}
      />
    </>
  )
}

export default App
