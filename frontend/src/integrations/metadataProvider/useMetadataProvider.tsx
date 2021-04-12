import React from 'react';
import Client from './client';

export const MetadataProviderContext = React.createContext<Client>(undefined!);

export const MetadataProviderContextProvider: React.FC = ({ children }) => (
  <MetadataProviderContext.Provider
    value={new Client('https://www.googleapis.com/books/v1/volumes?q=')}
  >
    {children}
  </MetadataProviderContext.Provider>
);

const useMetadataProvider = () => React.useContext(MetadataProviderContext);

export default useMetadataProvider;
