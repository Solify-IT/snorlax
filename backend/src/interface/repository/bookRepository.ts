import { wrapError } from 'src/@types';
import { Book } from 'src/domain/model';
import { IBookRepository } from 'src/usecases';
import IDatastore from './datastore';

export default class BookRepository implements IBookRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  async findAll(): Promise<Book[]> {
    const [books, error] = await wrapError(
      this.datastore.books.query(),
    );

    if (error) {
      throw error;
    }

    return books;
  }
}
