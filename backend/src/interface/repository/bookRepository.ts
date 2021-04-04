/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { wrapError } from 'src/@types';
import { Book, BookTableName, LocalBook } from 'src/domain/model';
import { IBookRepository } from 'src/usecases';
import IDatastore from './datastore';

export default class BookRepository implements IBookRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  async registerBook(bookData: Omit<LocalBook, 'id'>): Promise<string> {
    const id = uuidv4();

    const [result, error] = await wrapError(
      this.datastore.insert<LocalBook>(BookTableName, { ...bookData, id }),
    );

    if (error) {
      throw error;
    }

    return result!;
  }

  findAll(): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }

  findByISBN(isbn: string): Promise<Book> {
    throw new Error('Method not implemented.');
  }
}
