import { IonText } from '@ionic/react'

interface SessionTimerProps {
  elapsedSeconds: number
}

const formatTime = (totalSeconds: number): string => {
  if (totalSeconds >= 86400) {
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    return `${days}d ${hours}h`
  }
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const SessionTimer = ({ elapsedSeconds }: SessionTimerProps) => {
  return (
    <IonText
      style={{
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      {formatTime(elapsedSeconds)}
    </IonText>
  )
}
