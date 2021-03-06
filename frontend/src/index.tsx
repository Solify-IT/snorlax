import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App/App';
import reportWebVitals from './reportWebVitals';
import { NavigationContextProvider } from './hooks/navigation';
import { BackendProvider } from './integrations/backend';
import { MetadataProviderContextProvider } from './integrations/metadataProvider';
import { FirebaseProvider } from './hooks/firebase';
import { AuthContextProvider } from './hooks/auth';

ReactDOM.render(
  <React.StrictMode>
    <NavigationContextProvider>
      <MetadataProviderContextProvider>
        <FirebaseProvider>
          <AuthContextProvider>
            <BackendProvider>
              <App />
            </BackendProvider>
          </AuthContextProvider>
        </FirebaseProvider>
      </MetadataProviderContextProvider>
    </NavigationContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
