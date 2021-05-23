import faker from 'faker';
import { Sync, each } from 'factory.ts';
import { Library } from 'src/@types';

const LibraryFactory = Sync.makeFactory<Library>({
  id: each(() => faker.datatype.uuid()),
  address: each(() => faker.address.streetAddress()),
  city: each(() => faker.address.city()),
  email: each(() => faker.internet.email()),
  inCharge: each(() => faker.name.firstName()),
  name: each(() => faker.company.companyName()),
  phoneNumber: each(() => faker.phone.phoneNumber('##########')),
  state: each(() => faker.address.state()),
});

export default LibraryFactory;
