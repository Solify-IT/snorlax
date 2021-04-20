import { each, Sync } from 'factory.ts';
import faker from 'faker';
import User, { Permission, Role } from 'src/domain/model/user';
import LibraryFactory from './libraryFactory';

export const PermissionFactory = Sync.makeFactory<Permission>({
  id: each(() => faker.datatype.uuid()),
  name: each(() => faker.name.jobTitle()),
  description: each(() => faker.commerce.productDescription()),
});

export const RoleFactory = Sync.makeFactory<Role>({
  id: each(() => faker.datatype.uuid()),
  name: each(() => faker.name.jobTitle()),
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

export default UserFactory;
