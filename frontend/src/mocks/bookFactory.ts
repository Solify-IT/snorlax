import faker from 'faker';
import { Sync, each } from 'factory.ts';
import {
  LocalBook,
} from 'src/@types';
import CatalogueFactory from './catalogueFactory';

export const LocalBookFactory = Sync.makeFactory<LocalBook>({
  id: each(() => faker.datatype.uuid()),
  isbn: each(() => faker.datatype.string(10)),
  price: each(() => faker.datatype.number(2000)),
  libraryId: each(() => faker.datatype.uuid()),
  amount: each(() => faker.datatype.number(2000)),
});

export const ExternalBookFactory = CatalogueFactory;

const BookFactory = LocalBookFactory.combine(ExternalBookFactory);

export default BookFactory;
