import { each, Sync } from 'factory.ts';
import faker from 'faker';
import { Catalogue } from 'src/@types';

const CatalogueFactory = Sync.makeFactory<Catalogue>({
  id: each(() => faker.datatype.uuid()),
  area: each(() => faker.random.word()),
  author: each(() => faker.name.firstName()),
  collection: each(() => faker.random.word()),
  coverType: each(() => (faker.datatype.boolean() ? 'pasta dura' : 'pasta blanda')),
  coverImageUrl: each(() => faker.image.imageUrl()),
  distribuitor: each(() => faker.random.word()),
  editoral: each(() => faker.company.companyName()),
  isbn: each(() => faker.random.alpha({ count: 13 })),
  pages: each(() => faker.datatype.number(2000)),
  provider: each(() => faker.random.word()),
  subCategory: each(() => faker.random.word()),
  subTheme: each(() => faker.random.word()),
  synopsis: each(() => faker.random.words(30)),
  theme: each(() => faker.random.word()),
  title: each(() => faker.random.words(5)),
  type: each(() => faker.random.word()),
  unitaryCost: each(() => faker.datatype.float(5000)),
  libraryName: each(() => faker.random.word()),
  libraryPhone: each(() => faker.random.word()),
});

export default CatalogueFactory;
