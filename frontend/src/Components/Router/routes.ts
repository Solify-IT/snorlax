const HOME = '/';

export const INVENTORY = '/inventario';
export const SALES_POINT = '/punto-de-venta';
export const ADMIN = '/admin';

export const BOOKS = `${INVENTORY}/libros`;
export const NEW_BOOK = `${BOOKS}/nuevo`;
export const LIST_LOCAL_BOOKS = `${BOOKS}/lista-local`;

export const toBookDetail = (
  uuid: string,
) => `${BOOKS}/${uuid}`;

export const LIBRARIES = `${INVENTORY}/librerías`;

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
    },
  },
};

export default HOME;
