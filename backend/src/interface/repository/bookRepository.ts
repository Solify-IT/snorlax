/* eslint-disable @typescript-eslint/no-unused-vars */
import { Book } from 'src/domain/model';
import { IBookRepository } from 'src/usecases';
import IDatastore from './datastore';

export default class BookRepository implements IBookRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  findAll(): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }

  findByISBN(isbn: string): Promise<Book> {
    throw new Error('Method not implemented.');
  }
}
