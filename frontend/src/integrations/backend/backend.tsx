import React from 'react';
import { AxiosRequestConfig } from 'axios';
import {
  BookFormType, Catalogue, Library, LocalBook, Movement
} from 'src/@types';
import {
  TodaySale
} from 'src/@types/movement';
import {
  BACKEND_MAIN_EP,
  BOOKS_ROOT,
  LIBRARIES_ROOT,
  USERS_ROOT,
  CATALOGUE_ROOT,
  MOVEMENTS_ROOT,
  USERS_ROOT_ID,
  LIBRARIES_ROOT_ID,
  TODAY_SALE,
} from 'src/settings';
import User, { UserInput } from 'src/@types/user';
import useAuth from 'src/hooks/auth';
import { LibraryInput } from 'src/@types/library';
import CRUD from './crud';

export type RegisterBook = BookFormType & { libraryId: Library['id'] };

export class Backend {
  rootEndpoint: string;

  books: CRUD<LocalBook, RegisterBook, RegisterBook & { id: string }>;

  users: CRUD<User, UserInput, UserInput>;

  usersId : CRUD<User, UserInput, UserInput>;

  librariesId : CRUD<Library, LibraryInput, LibraryInput>;

  libraries: CRUD<Library, unknown, unknown>;

  catalogue: CRUD<Catalogue, unknown, unknown>;

  movements: CRUD<Movement, unknown, unknown>;

  todaySale: CRUD<TodaySale, unknown, unknown>;

  public constructor(rootEndpoint: string, config?: AxiosRequestConfig) {
    this.rootEndpoint = rootEndpoint;
    this.books = new CRUD(
      `${this.rootEndpoint}${BOOKS_ROOT}`, config,
    );
    this.users = new CRUD(
      `${this.rootEndpoint}${USERS_ROOT}`, config,
    );

    this.usersId = new CRUD(
      `${this.rootEndpoint}${USERS_ROOT_ID}`, config,
    );

    this.libraries = new CRUD(
      `${this.rootEndpoint}${LIBRARIES_ROOT}`, config,
    );

    this.librariesId = new CRUD(
      `${this.rootEndpoint}${LIBRARIES_ROOT_ID}`, config,
    );
    this.catalogue = new CRUD(
      `${this.rootEndpoint}${CATALOGUE_ROOT}`, config,
    );
    this.movements = new CRUD(
      `${this.rootEndpoint}${MOVEMENTS_ROOT}`, config,
    );
    this.todaySale = new CRUD(
      `${this.rootEndpoint}${TODAY_SALE}`, config,
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
