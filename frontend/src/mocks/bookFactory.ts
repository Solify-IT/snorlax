import faker from 'faker';
import { Sync, each } from 'factory.ts';
import {
  LocalBook, ExternalBook,
} from 'src/@types';
import LibraryFactory from './libraryFactory';

export const LocalBookFactory = Sync.makeFactory<LocalBook>({
  id: each(() => faker.datatype.uuid()),
  isbn: each(() => faker.datatype.string(10)),
  price: each(() => faker.datatype.number(2000)),
  libraryId: each(() => faker.datatype.uuid()),
  library: each(() => LibraryFactory.build()),
});

export const ExternalBookFactory = Sync.makeFactory<ExternalBook>({
  title: each(() => faker.commerce.productName()),
  isbn: each(() => faker.datatype.string(10)),
  authors: each(
    () => Array(faker.datatype.number(5))
      .fill(null)
      .map(() => `${faker.name.firstName()} ${faker.name.lastName()}`),
  ),
  coverURL: each(() => faker.image.imageUrl()),
});

const BookFactory = LocalBookFactory.combine(ExternalBookFactory);

export default BookFactory;
