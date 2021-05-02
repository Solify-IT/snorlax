import { each, Sync } from 'factory.ts';
import faker from 'faker';
import { Catalogue } from 'src/domain/model';

const CatalogueFactory = Sync.makeFactory<Catalogue>({
  id: each(() => faker.datatype.uuid()),
  area: each(() => faker.name.jobArea()),
  author: each(() => faker.name.firstName()),
  collection: each(() => faker.name.jobArea()),
  cover: each(() => (faker.datatype.boolean() ? 'pasta dura' : 'pasta blanda')),
  distribuitor: each(() => faker.company.companyName()),
  editoral: each(() => faker.company.companyName()),
  isbn: each(() => faker.random.alpha({ count: 13 })),
  pages: each(() => faker.datatype.number(2000)),
  provider: each(() => faker.company.companyName()),
  sub_category: each(() => faker.random.alpha({ count: 13 })),
  sub_theme: each(() => faker.random.alpha({ count: 13 })),
  synopsis: each(() => faker.random.words(30)),
  theme: each(() => faker.random.words(1)),
  title: each(() => faker.random.words(5)),
  type: each(() => faker.random.words(5)),
  unitary_cost: each(() => faker.datatype.float(5000)),
});

export default CatalogueFactory;
