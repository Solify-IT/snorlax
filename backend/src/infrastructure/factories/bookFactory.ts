import faker from 'faker';
import { Sync, each } from 'factory.ts';
import {
  LocalBook, ExternalBook, BOOK_TABLE_NAME, Library, LocalBookInput,
} from 'src/domain/model';
import { IDatastore } from 'src/interface/repository';
import LibraryFactory, { givenALibrary } from './libraryFactory';
import CatalogueFactory from './catalogueFactory';

export const LocalBookFactory = Sync.makeFactory<LocalBook>({
  id: each(() => faker.datatype.uuid()),
  isbn: each(() => faker.datatype.string(10)),
  price: each(() => faker.datatype.number(2000)),
  libraryId: each(() => faker.datatype.uuid()),
  library: each(() => LibraryFactory.build()),
  amount: each(() => faker.datatype.number(2000)),
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

const BookFactory = LocalBookFactory.combine(CatalogueFactory);

export const givenALocalBook = async (
  datastore: IDatastore, library?: Library, localBook?: LocalBook,
) => {
  const lib = library || LibraryFactory.build();
  const book = localBook || LocalBookFactory.build({ libraryId: lib.id, library: lib });

  if (!library) {
    await givenALibrary(datastore, lib);
  }
  await datastore.insert<LocalBookInput>(BOOK_TABLE_NAME, {
    id: book.id, isbn: book.isbn, libraryId: lib.id, price: book.price, amount: book.amount,
  });

  return book;
};

export default BookFactory;
