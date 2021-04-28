import React from 'react';
import { AxiosRequestConfig } from 'axios';
import { LocalBook, LocalBookInput, MovementInputData } from 'src/@types';
import { BACKEND_MAIN_EP, BOOKS_ROOT } from 'src/settings';
import CRUD from './crud';

export type RegisterBook = Omit<LocalBookInput & MovementInputData, 'id' | 'localBookId'>;

export class Backend {
  rootEndpoint: string;

  books: CRUD<LocalBook, RegisterBook, RegisterBook>;

  public constructor(rootEndpoint: string, config?: AxiosRequestConfig) {
    this.rootEndpoint = rootEndpoint;
    this.books = new CRUD(
      `${this.rootEndpoint}${BOOKS_ROOT}`, config,
    );

  }
}

export const BackendContext = React.createContext<Backend>(undefined!);

export const BackendProvider: React.FC = ({ children }) => (
  <BackendContext.Provider value={new Backend(BACKEND_MAIN_EP)}>
    {children}
  </BackendContext.Provider>
);

export const useBackend = () => React.useContext(BackendContext);

export default BackendContext;
