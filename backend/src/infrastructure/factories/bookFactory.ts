import faker from 'faker';
import { Sync, each } from 'factory.ts';
import { Book } from 'src/domain/model';

const BookFactory = Sync.makeFactory<Book>({
  id: each(() => faker.datatype.uuid()),
  title: each(() => faker.commerce.productName()),
  isbn: each(() => faker.datatype.string(10)),
  price: each(() => faker.datatype.number(2000)),
  author: each(() => `${faker.name.firstName} ${faker.name.lastName}`),
});

export default BookFactory;
