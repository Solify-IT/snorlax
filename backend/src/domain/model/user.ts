import CommonType from './common';
import { Library } from './library';

export type StoredRole = CommonType & {
  name: string,
  description: string,
};

export type Permission = CommonType & {
  name: string,
  description: string,
};

export type RolePermission = CommonType & {
  roleId: StoredRole['id'],
  permissionId: Permission['id'],
};

export type Role = StoredRole & {
  permissions: Permission[],
};

export type StoredUser = CommonType & {
  email: string,
  displayName: string,
  disabled: boolean,
  roleId: StoredRole['id'],
  libraryId: Permission['id'],
};

type User = StoredUser & {
  library: Library,
  role: Role,
};

export type UserInput = Omit<StoredUser, 'id'> & {
  password: string,
};

export const USER_TABLE_NAME = 'users';
export const ROLE_TABLE_NAME = 'roles';
export const PERMISSION_TABLE_NAME = 'permissions';
export const ROLES_PERMISSION_TABLE_NAME = 'roles_permissions';

export default User;
