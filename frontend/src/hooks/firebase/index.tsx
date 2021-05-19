import React from 'react';
import Firebase from 'src/integrations/firebase/firebase';

export const FirebaseContext = React.createContext<Firebase>(undefined!);

export const FirebaseProvider: React.FC = ({ children }) => (
  <FirebaseContext.Provider value={new Firebase()}>
    { children }
  </FirebaseContext.Provider>
);

const useFirebase = () => React.useContext(FirebaseContext);

export default useFirebase;
