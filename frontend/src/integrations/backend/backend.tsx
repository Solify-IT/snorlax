import React from 'react';
import { AxiosRequestConfig } from 'axios';
import {
  BookFormType, Catalogue, Library, LocalBook,
} from 'src/@types';
import {
  BACKEND_MAIN_EP, BOOKS_ROOT, LIBRARIES_ROOT, USERS_ROOT, CATALOGUE_ROOT,
} from 'src/settings';
import User, { UserInput } from 'src/@types/user';
import useAuth from 'src/hooks/auth';
import CRUD from './crud';

export type RegisterBook = BookFormType & { libraryId: Library['id'] };

export class Backend {
  rootEndpoint: string;

  books: CRUD<LocalBook, RegisterBook, RegisterBook>;

  users: CRUD<User, UserInput, UserInput>;

  libraries: CRUD<Library, unknown, unknown>;

  catalogue: CRUD<Catalogue, unknown, unknown>;

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
    this.catalogue = new CRUD(
      `${this.rootEndpoint}${CATALOGUE_ROOT}`, config,
    );
  }
}

export const BackendContext = React.createContext<Backend>(undefined!);

export const BackendProvider: React.FC = ({ children }) => {
  const { idToken } = useAuth();
  return (
    <BackendContext.Provider
      value={new Backend(BACKEND_MAIN_EP, {
        headers: {
          Authorization: idToken || undefined,
        },
      })}
    >
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () => React.useContext(BackendContext);

export default BackendContext;
