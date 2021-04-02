import faker from 'faker';
import { Sync, each } from 'factory.ts';
import { Book, LocalBook, ExternalBook } from 'src/domain/model';

export const LocalBookFactory = Sync.makeFactory<LocalBook>({
  id: each(() => faker.datatype.uuid()),
  isbn: each(() => faker.datatype.string(10)),
  price: each(() => faker.datatype.number(2000)),
});

export const ExternalBookFactory = Sync.makeFactory<ExternalBook>({
  title: each(() => faker.commerce.productName()),
  isbn: each(() => faker.datatype.string(10)),
  authors: each(
    () => Array(faker.datatype.number(5))
      .fill(null)
      .map(() => `${faker.name.firstName()} ${faker.name.lastName()}`),
  ),
});

const BookFactory = Sync.makeFactory<Book>(null)
  .combine(LocalBookFactory)
  .combine(ExternalBookFactory);

export default BookFactory;
