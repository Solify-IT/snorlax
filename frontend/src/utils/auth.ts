import {
  ADMIN_ROLE_NAME, AuthUserType, LIBRERO_ROLE_NAME, CAJERO_ROLE_NAME, ALMACENISTA_ROLE_NAME,
} from 'src/hooks/auth';

export const isAdmin = (user: AuthUserType) => user.role.name === ADMIN_ROLE_NAME;

export const isLibrero = (user: AuthUserType) => user.role.name === LIBRERO_ROLE_NAME;

export const isCajero = (user: AuthUserType) => user.role.name === CAJERO_ROLE_NAME;

export const isAlmacenista = (user: AuthUserType) => user.role.name === ALMACENISTA_ROLE_NAME;
