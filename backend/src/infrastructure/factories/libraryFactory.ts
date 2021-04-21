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
  datastore: IDatastore, library?: Library | Library[],
) => {
  // eslint-disable-next-line no-nested-ternary
  const lib = library
    ? Array.isArray(library)
      ? library
      : [library]
    : [LibraryFactory.build()];

  // eslint-disable-next-line no-restricted-syntax
  for (const libr of lib) {
    // eslint-disable-next-line no-await-in-loop
    await datastore.insert(LIBRARY_TABLE_NAME, libr);
  }

  return lib;
};

export default LibraryFactory;
