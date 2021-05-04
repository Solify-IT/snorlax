import React from 'react';
import { AxiosRequestConfig } from 'axios';
import {
  BookFormType, Library, LocalBook,
} from 'src/@types';
import {
  BACKEND_MAIN_EP, BOOKS_ROOT, LIBRARIES_ROOT, USERS_ROOT,
} from 'src/settings';
import User, { UserInput } from 'src/@types/user';
import CRUD from './crud';

export type RegisterBook = BookFormType & { libraryId: Library['id'] };

export class Backend {
  rootEndpoint: string;

  books: CRUD<LocalBook, RegisterBook, RegisterBook>;

  users: CRUD<User, UserInput, UserInput>;

  libraries: CRUD<Library, unknown, unknown>;

  public constructor(rootEndpoint: string, config?: AxiosRequestConfig) {
    this.rootEndpoint = rootEndpoint;
    this.books = new CRUD(
      `${this.rootEndpoint}${BOOKS_ROOT}`, config,
    );
    this.users = new CRUD(
      `${this.rootEndpoint}${USERS_ROOT}`, config,
    );
    this.libraries = new CRUD(
      `${this.rootEndpoint}${LIBRARIES_ROOT}`, config,
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
