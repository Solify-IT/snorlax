/* eslint-disable @typescript-eslint/no-unused-vars */
import { Book, LocalBook } from 'src/domain/model';
import { IBookRepository } from 'src/usecases';
import IDatastore from './datastore';

export default class BookRepository implements IBookRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  registerBook(bookData: Omit<LocalBook, 'id'>): Promise<string> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }

  findByISBN(isbn: string): Promise<Book> {
    throw new Error('Method not implemented.');
  }
}
