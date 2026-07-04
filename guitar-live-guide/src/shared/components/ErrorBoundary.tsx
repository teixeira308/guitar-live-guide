import { Component, type ReactNode, type ErrorInfo } from 'react'
import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonIcon,
} from '@ionic/react'
import { alertCircle } from 'ionicons/icons'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <IonPage>
          <IonContent className="ion-padding">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', textAlign: 'center', gap: '1rem' }}>
              <IonIcon icon={alertCircle} color="danger" style={{ fontSize: 56 }} />
              <IonText color="danger">
                <h2 style={{ fontWeight: 700 }}>Algo deu errado</h2>
              </IonText>
              <IonText color="medium">
                <p style={{ maxWidth: 360 }}>
                  {this.state.error?.message || 'Ocorreu um erro inesperado'}
                </p>
              </IonText>
              <IonButton size="large" onClick={() => window.location.reload()}>
                Recarregar
              </IonButton>
            </div>
          </IonContent>
        </IonPage>
      )
    }
    return this.props.children
  }
}
