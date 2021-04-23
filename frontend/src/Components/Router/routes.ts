const HOME = '/';

export const BOOKS = '/libros';
export const NEW_BOOK = `${BOOKS}/nuevo`;
export const LIST_LOCAL_BOOKS = `${BOOKS}/lista-local`;

export const USERS = '/usuarios';
export const LIST_USERS = `${USERS}/lista-local`;
export const NEW_USER = `${USERS}/nuevo`;

export const toBookDetail = (
  uuid: string,
) => `${BOOKS}/${uuid}`;
export const toUserDetail = (
  uuid: string,
) => `${USERS}/${uuid}`;

export default HOME;
