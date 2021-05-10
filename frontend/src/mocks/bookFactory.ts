import faker from 'faker';
import { Sync, each } from 'factory.ts';
import {
  LocalBook,
} from 'src/@types';
import LibraryFactory from './libraryFactory';
import CatalogueFactory from './catalogueFactory';

export const LocalBookFactory = Sync.makeFactory<LocalBook>({
  id: each(() => faker.datatype.uuid()),
  isbn: each(() => faker.datatype.string(10)),
  price: each(() => faker.datatype.number(2000)),
  libraryId: each(() => faker.datatype.uuid()),
  library: each(() => LibraryFactory.build()),
});

export const ExternalBookFactory = CatalogueFactory;

const BookFactory = LocalBookFactory.combine(ExternalBookFactory);

export default BookFactory;
