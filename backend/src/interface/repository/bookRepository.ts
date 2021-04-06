/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { wrapError } from 'src/@types';
import {
  Book, BOOK_TABLE_NAME, LocalBookInput,
} from 'src/domain/model';
import { IBookRepository } from 'src/usecases';
import IDatastore from './datastore';

export default class BookRepository implements IBookRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  async registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<string> {
    const id = uuidv4();

    const [result, error] = await wrapError(
      this.datastore.insert<LocalBookInput>(
        BOOK_TABLE_NAME, { ...bookData, id },
      ),
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
