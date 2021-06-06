const HOME = '/';

export const SIGN_IN = '/sign-in';
export const FORGOT_PASSWORD = '/recover-password';

export const INVENTORY = '/inventario';
export const SALES_POINT = '/punto-de-venta';
export const RETURNS = `${SALES_POINT}/devoluciones`;
export const RETURNSCLIENT = `${SALES_POINT}/devolucionescliente`;
export const MOVEMENTS = `${SALES_POINT}/movimientos`;

export const ADMIN = '/admin';

export const BOOKS = `${INVENTORY}/libros`;
export const NEW_BOOK = `${BOOKS}/nuevo`;

export const BOOK_DETAIL = `${BOOKS}/:id`;
export const BOOK_UPDATE = `${BOOKS}/:id/actualizar`;
export const LIST_LOCAL_BOOKS = `${BOOKS}/buscar`;

export const toBookDetail = (
  uuid: string,
) => `${BOOKS}/${uuid}`;

export const toBookUpdate = (
  uuid: string,
) => `${BOOKS}/${uuid}/actualizar`;

export const LIBRARIES = `${ADMIN}/librerías`;
export const NEW_LIBRARY = `${LIBRARIES}/nuevo`;
export const UPDATE_LIBRRY = `${LIBRARIES}/modificar-libreria/:id`;
export const UPDATE_LIBRARY_ID = `${LIBRARIES}/modificar-libreria`;

export const toLibraryDetail = (
  uuid: string,
) => `${UPDATE_LIBRARY_ID}/${uuid}`;
export const toLibraryList = (
) => `${LIBRARIES}`;

export const USERS = `${ADMIN}/usuarios`;
export const LIST_USERS = `${USERS}/lista-local`;
export const NEW_USER = `${USERS}/nuevo`;
export const UPDATE_USER = `${USERS}/modificar-usuario/:id`;
export const UPDATE_USER_ID = `${USERS}/modificar-usuario`;

export const toUserDetail = (
  uuid: string,
) => `${UPDATE_USER_ID}/${uuid}`;
export const toUserList = (
) => `${LIST_USERS}`;

export const menuItemKeys = {
  intentory: 'inventory',
  salesPoint: 'salesPoint',
  returns: 'returns',
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

export const sideMenuItemsPost = {
  salesPoint: {
    books: {
      sales_Point: 'section-sales_point',
    },
  },
};

export default HOME;
