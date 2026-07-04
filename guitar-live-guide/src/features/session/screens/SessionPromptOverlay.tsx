import { IonModal, IonButton, IonText } from '@ionic/react'
import { useAppDispatch } from '../../../app/hooks'
import { resetSession } from '../store/sessionSlice'

interface SessionPromptOverlayProps {
  onResume: () => void
  onNewSession: () => void
}

export const SessionPromptOverlay = ({
  onResume,
  onNewSession,
}: SessionPromptOverlayProps) => {
  const dispatch = useAppDispatch()

  const handleNewSession = () => {
    dispatch(resetSession())
    onNewSession()
  }

  return (
    <IonModal isOpen={true} canDismiss={false}>
      <div style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', minHeight: '100%' }}>
        <IonText>
          <h2 style={{ fontWeight: 700 }}>Continuar Sessão Anterior?</h2>
        </IonText>
        <IonText color="medium">
          <p>
            Você tem uma sessão ativa da última vez.
            Deseja continuar ou começar uma nova?
          </p>
        </IonText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <IonButton expand="block" size="large" onClick={onResume}>
            Continuar
          </IonButton>
          <IonButton expand="block" size="large" fill="outline" onClick={handleNewSession}>
            Nova Sessão
          </IonButton>
        </div>
      </div>
    </IonModal>
  )
}
