import User, { StoredUser, USER_TABLE_NAME } from 'src/domain/model/user';
import IUserRepository from 'src/usecases/repository/userRepository';
import { IDatastore } from '.';

export default class UserRepository implements IUserRepository {
  private datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  async createUser(userData: StoredUser): Promise<User['id']> {
    return this.datastore.insert<StoredUser>(USER_TABLE_NAME, {
      ...userData,
    });
  }
}
