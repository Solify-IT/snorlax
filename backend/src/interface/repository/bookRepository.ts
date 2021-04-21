/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import {
  Book, BOOK_TABLE_NAME, LocalBook, LocalBookInput,
} from 'src/domain/model';
import { IBookRepository } from 'src/usecases';
import IDatastore from './datastore';
import { Maybe } from 'src/@types';

export default class BookRepository implements IBookRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  async findById(id: string): Promise<Maybe<LocalBook>> {
    const book = await this.datastore.getById<LocalBook>(
       BOOK_TABLE_NAME,id
    );
    return book;
  }

  async registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<string> {
    const id = uuidv4();

    const result = await this.datastore.insert<LocalBookInput>(
      BOOK_TABLE_NAME, { ...bookData, id },
    );

    return result;
  }

  findAll(): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }

  async findByISBN(isbn: string): Promise<LocalBook[]> {
    const books = await this.datastore.get<LocalBook>(
      `SELECT * FROM ${BOOK_TABLE_NAME} WHERE isbn = $1`, [isbn],
    );

    return books;
  }
}
