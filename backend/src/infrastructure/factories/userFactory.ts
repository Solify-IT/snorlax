import { each, Sync } from 'factory.ts';
import faker from 'faker';
import User, {
  Permission, Role, ROLE_TABLE_NAME, StoredRole,
} from 'src/domain/model/user';
import { IDatastore } from 'src/interface/repository';
import LibraryFactory from './libraryFactory';

export const PermissionFactory = Sync.makeFactory<Permission>({
  id: each(() => faker.datatype.uuid()),
  name: each(() => faker.datatype.string(15)),
  description: each(() => faker.commerce.productDescription()),
});

export const RoleFactory = Sync.makeFactory<Role>({
  id: each(() => faker.datatype.uuid()),
  name: each(() => faker.datatype.string(15)),
  description: each(() => faker.commerce.productDescription()),
  permissions: each(() => PermissionFactory.buildList(3)),
});

const UserFactory = Sync.makeFactory<User>({
  id: each(() => faker.datatype.uuid()),
  displayName: each(() => faker.name.firstName()),
  email: each(() => faker.internet.email()),
  disabled: false,
  libraryId: each(() => faker.datatype.uuid()),
  roleId: each(() => faker.datatype.uuid()),
  library: each(() => LibraryFactory.build()),
  role: each(() => RoleFactory.build()),
});

export const givenARole = async (
  datastore: IDatastore, passedRoles?: Role | Role[],
) => {
  // eslint-disable-next-line no-nested-ternary
  const roles = passedRoles
    ? Array.isArray(passedRoles)
      ? passedRoles
      : [passedRoles]
    : [RoleFactory.build()];

  // eslint-disable-next-line no-restricted-syntax
  for (const role of roles) {
    // eslint-disable-next-line no-await-in-loop
    await datastore.insert<StoredRole>(ROLE_TABLE_NAME, {
      id: role.id, description: role.description, name: role.name,
    });
  }

  return roles;
};

export default UserFactory;
