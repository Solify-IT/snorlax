import { each, Sync } from 'factory.ts';
import faker from 'faker';
import { Catalogue, CATALOGUE_TABLE_NAME } from 'src/domain/model';
import { IDatastore } from 'src/interface/repository';

const CatalogueFactory = Sync.makeFactory<Catalogue>({
  id: each(() => faker.datatype.uuid()),
  area: each(() => faker.name.jobArea()),
  author: each(() => faker.name.firstName()),
  collection: each(() => faker.name.jobArea()),
  coverType: each(() => (faker.datatype.boolean() ? 'pasta dura' : 'pasta blanda')),
  coverImageURL: each(() => faker.image.imageUrl()),
  distribuitor: each(() => faker.company.companyName()),
  editoral: each(() => faker.company.companyName()),
  isbn: each(() => faker.random.alpha({ count: 13 })),
  pages: each(() => faker.datatype.number(2000)),
  provider: each(() => faker.company.companyName()),
  subCategory: each(() => faker.random.alpha({ count: 13 })),
  subTheme: each(() => faker.random.alpha({ count: 13 })),
  synopsis: each(() => faker.random.words(30)),
  theme: each(() => faker.random.words(1)),
  title: each(() => faker.random.words(5)),
  type: each(() => faker.random.words(5)),
  unitaryCost: each(() => faker.datatype.float(5000)),
});

export const givenACatalogueItem = async (
  datastore: IDatastore, passedCatalogue?: Catalogue | Catalogue[],
) => {
  // eslint-disable-next-line no-nested-ternary
  const catalogues = passedCatalogue
    ? Array.isArray(passedCatalogue)
      ? passedCatalogue
      : [passedCatalogue]
    : [CatalogueFactory.build()];

  // eslint-disable-next-line no-restricted-syntax
  for (const catalgue of catalogues) {
    // eslint-disable-next-line no-await-in-loop
    await datastore.insert(CATALOGUE_TABLE_NAME, catalgue);
  }

  return catalogues;
};

export default CatalogueFactory;
