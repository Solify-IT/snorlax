import User, {
  ROLE_TABLE_NAME, StoredRole, StoredUser, USER_TABLE_NAME,
} from 'src/domain/model/user';
import IUserRepository from 'src/usecases/repository/userRepository';
import { IDatastore } from '.';

export default class UserRepository implements IUserRepository {
  private datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  listUsers(): Promise<StoredUser[]> {
    return this.datastore.get(`SELECT * from ${USER_TABLE_NAME}`);
  }

  listAllRoles(): Promise<StoredRole[]> {
    return this.datastore.get(`SELECT * FROM ${ROLE_TABLE_NAME}`);
  }

  async createUser(userData: StoredUser): Promise<User['id']> {
    return this.datastore.insert<StoredUser>(USER_TABLE_NAME, {
      ...userData,
    });
  }
}
