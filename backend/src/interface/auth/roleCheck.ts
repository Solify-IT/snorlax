import { ADMIN_ROLE, LIBRERO_ROLE, Role } from 'src/domain/model/user';

export const isAdmin = (roleName: Role['name']) => roleName === ADMIN_ROLE;

export const isLibrero = (roleName: Role['name']) => roleName === LIBRERO_ROLE;
