import React from 'react';
import { AxiosRequestConfig } from 'axios';
import { LocalBook, LocalBookInput, MovementInputData } from 'src/@types';
import { BACKEND_MAIN_EP, BOOKS_ROOT, USERS_ROOT } from 'src/settings';
import User, { UserInput } from 'src/@types/user';
import CRUD from './crud';

export type RegisterBook = Omit<LocalBookInput & MovementInputData, 'id' | 'localBookId'>;

export class Backend {
  rootEndpoint: string;

  books: CRUD<LocalBook, RegisterBook, RegisterBook>;

  users: CRUD<User, UserInput, UserInput>;

  public constructor(rootEndpoint: string, config?: AxiosRequestConfig) {
    this.rootEndpoint = rootEndpoint;
    this.books = new CRUD(
      `${this.rootEndpoint}${BOOKS_ROOT}`, config,
    );
    this.users = new CRUD(
      `${this.rootEndpoint}${USERS_ROOT}`, config,
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
