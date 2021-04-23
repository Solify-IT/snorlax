const HOME = '/';

export const INVENTORY = '/inventario';
export const SALES_POINT = '/punto-de-venta';
export const ADMIN = '/admin';

export const BOOKS = `${INVENTORY}/libros`;
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

export const LIBRARIES = `${ADMIN}/librerías`;

export const toLibraryDetail = (
  uuid: string,
) => `${LIBRARIES}/${uuid}`;

export const menuItemKeys = {
  intentory: 'inventory',
  salesPoint: 'salesPoint',
  admin: 'admin',
};

export const sideMenuItemsOpen = {
  inventory: {
    books: 'section-inventory-books',
  },
  admin: {
    libraries: 'section-admin-libraries',
  },
};

export const sideMenuItems = {
  inventory: {
    books: {
      newBook: 'section-inventory-books-new',
      list: 'section-inventory-books-list',
    },
  },
};

export default HOME;
