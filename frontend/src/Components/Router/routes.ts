const HOME = '/';

export const BOOKS = '/libros';
export const NEW_BOOK = `${BOOKS}/nuevo`;
export const BOOK_DETAIL = `${BOOKS}/:id`;
export const LIST_LOCAL_BOOKS = `${BOOKS}/lista-local`;

export const toBookDetail = (
  uuid: string,
) => `${BOOKS}/${uuid}`;

export default HOME;
