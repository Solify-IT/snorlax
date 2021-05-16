import { Maybe } from 'src/@types';
import User, { StoredRole, StoredUser } from 'src/domain/model/user';

export default interface IUserRepository {
  createUser(userData: StoredUser): Promise<User['id']>;
  listAllRoles(): Promise<StoredRole[]>;
  listUsers(): Promise<StoredUser[]>;
  findOneOrNullByEmail(email: string): Promise<Maybe<User>>;
}
