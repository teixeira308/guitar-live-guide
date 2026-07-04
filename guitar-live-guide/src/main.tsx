import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { IonApp, setupIonicReact } from '@ionic/react'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
/* Optional CSS utils */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
/* Ionic Dark Mode - always dark */
import '@ionic/react/css/palettes/dark.always.css'

/* Theme variables */
import './theme/variables.css'

import { store } from './app/store'
import { AuthProvider } from './features/auth/AuthProvider'
import { ErrorBoundary } from './shared/components/ErrorBoundary'
import App from './App'

setupIonicReact({
  mode: 'ios',
})

const root = document.getElementById('root')
if (!root) {
  throw new Error('[Main] Root element not found')
}
createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <IonApp>
          <AuthProvider>
            <App />
          </AuthProvider>
        </IonApp>
      </ErrorBoundary>
    </Provider>
  </StrictMode>
)
