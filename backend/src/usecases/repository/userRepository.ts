import User, { StoredUser } from 'src/domain/model/user';

export default interface IUserRepository {
  createUser(userData: StoredUser): Promise<User['id']>;
}
