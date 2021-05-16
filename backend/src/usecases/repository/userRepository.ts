import User, { StoredRole, StoredUser } from 'src/domain/model/user';

export default interface IUserRepository {
  createUser(userData: StoredUser): Promise<User['id']>;
  updateUser(userData: StoredUser): Promise<StoredUser>;
  listAllRoles(): Promise<StoredRole[]>;
  listUsers(): Promise<StoredUser[]>;
}
