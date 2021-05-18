import { Maybe } from 'src/@types';
import User, {
  ROLE_TABLE_NAME, StoredRole, StoredUser, USER_TABLE_NAME,
} from 'src/domain/model/user';
import IUserRepository from 'src/usecases/repository/userRepository';
import BaseRepository from './BaseRepository';

export default class UserRepository extends BaseRepository implements IUserRepository {
  async findOneOrNullByEmail(email: string): Promise<Maybe<User>> {
    const userData = await this.datastore.getOneOrNull<any>(`
      SELECT
      u.id AS user_id,
      u.role_id AS user_role_id,
      u.created_at AS user_created_at,
      u.disabled AS user_disabled,
      u.display_name AS user_display_name,
      u.email AS user_email,
      u.library_id AS user_library_id,
      u.updated_at AS user_updated_at,
      r.id AS role_id,
      r.created_at AS role_created_at,
      r.updated_at AS role_updated_at,
      r.description AS role_description,
      r.name AS role_name,
      l.created_at AS library_created_at,
      l.email AS library_email,
      l.id AS library_id,
      l.name AS library_name,
      l.updated_at AS library_updated_at,
      l.address AS library_address,
      l.city AS library_city,
      l.in_charge AS library_in_charge,
      l.phone_number AS library_phone_number,
      l.state AS library_state
    FROM
      users u,
      roles r,
      libraries l
    WHERE
      r.id = u.role_id
      AND l.id = u.library_id
      AND u.email = $1
    `, [email]);

    return {
      disabled: userData.userDisabled,
      email: userData.userEmail,
      displayName: userData.userDisplayName,
      id: userData.userId,
      libraryId: userData.userLibraryId,
      library: {
        address: userData.libraryAddress,
        city: userData.libraryCity,
        email: userData.libraryEmail,
        id: userData.libraryId,
        inCharge: userData.libraryInCharge,
        name: userData.libraryName,
        phoneNumber: userData.libraryPhoneNumber,
        state: userData.libraryState,
        createdAt: userData.libraryCreatedAt,
        updatedAt: userData.libraryUpdatedAt,
      },
      roleId: userData.userRoleId,
      role: {
        description: userData.roleDescription,
        id: userData.roleId,
        name: userData.roleName,
        permissions: [],
        createdAt: userData.roleCreatedAt,
      },
    };
  }

  async listUsers(): Promise<User[]> {
    const allUsersData = await this.datastore.get<any>(`
      SELECT
      u.id AS user_id,
      u.role_id AS user_role_id,
      u.created_at AS user_created_at,
      u.disabled AS user_disabled,
      u.display_name AS user_display_name,
      u.email AS user_email,
      u.library_id AS user_library_id,
      u.updated_at AS user_updated_at,
      r.id AS role_id,
      r.created_at AS role_created_at,
      r.updated_at AS role_updated_at,
      r.description AS role_description,
      r.name AS role_name,
      l.created_at AS library_created_at,
      l.email AS library_email,
      l.id AS library_id,
      l.name AS library_name,
      l.updated_at AS library_updated_at,
      l.address AS library_address,
      l.city AS library_city,
      l.in_charge AS library_in_charge,
      l.phone_number AS library_phone_number,
      l.state AS library_state
    FROM
      users u,
      roles r,
      libraries l
    WHERE
      r.id = u.role_id
      AND l.id = u.library_id
    `);

    const users: User[] = [];

    allUsersData.forEach((userData) => {
      users.push({
        disabled: userData.userDisabled,
        email: userData.userEmail,
        displayName: userData.userDisplayName,
        id: userData.userId,
        libraryId: userData.userLibraryId,
        library: {
          address: userData.libraryAddress,
          city: userData.libraryCity,
          email: userData.libraryEmail,
          id: userData.libraryId,
          inCharge: userData.libraryInCharge,
          name: userData.libraryName,
          phoneNumber: userData.libraryPhoneNumber,
          state: userData.libraryState,
          createdAt: userData.libraryCreatedAt,
          updatedAt: userData.libraryUpdatedAt,
        },
        roleId: userData.userRoleId,
        role: {
          description: userData.roleDescription,
          id: userData.roleId,
          name: userData.roleName,
          permissions: [],
          createdAt: userData.roleCreatedAt,
        },
      });
    });
    return users;
  }

  listAllRoles(): Promise<StoredRole[]> {
    return this.datastore.get(`SELECT * FROM ${ROLE_TABLE_NAME}`);
  }

  async getUser(id: string):Promise<StoredUser[]> {
    return this.datastore.get(`SELECT * FROM ${USER_TABLE_NAME} WHERE id = '${id}' `);
  }

  async createUser(userData: StoredUser): Promise<User['id']> {
    return this.datastore.insert<StoredUser>(USER_TABLE_NAME, {
      ...userData,
    });
  }

  async updateUser(userData: StoredUser): Promise<StoredUser> {
    return this.datastore.update<StoredUser>(USER_TABLE_NAME, `email = '${userData.email}'`, {
      ...userData,
    });
  }
}
