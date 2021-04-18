const HOME = '/';

export const BOOKS = '/libros';
export const NEW_BOOK = `${BOOKS}/nuevo`;
export const LIST_LOCAL_BOOKS = `${BOOKS}/lista-local`;
export const SEARCH_LOCAL_BOOKS = `${BOOKS}/buscar-local`;

export const toBookDetail = (
  uuid: string,
) => `${BOOKS}/${uuid}`;

export default HOME;
