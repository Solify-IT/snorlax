import faker from 'faker';
import { Sync, each } from 'factory.ts';
import { Library, LIBRARY_TABLE_NAME } from 'src/domain/model';
import { IDatastore } from 'src/interface/repository';

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

export const givenALibrary = async (
  datastore: IDatastore, library?: Library,
) => {
  const lib = library || LibraryFactory.build();

  await datastore.insert(LIBRARY_TABLE_NAME, lib);

  return lib;
};

export default LibraryFactory;
