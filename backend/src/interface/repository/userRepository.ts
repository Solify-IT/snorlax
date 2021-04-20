import User, { StoredUser } from 'src/domain/model/user';
import IUserRepository from 'src/usecases/repository/userRepository';
import { IDatastore } from '.';

export default class UserRepository implements IUserRepository {
  private datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  createUser(userData: StoredUser): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
