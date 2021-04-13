/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import {
  Book, BOOK_TABLE_NAME, LocalBook, LocalBookInput,
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

  async getBookInLibrary(libraryId: string, isbn: string): Promise<LocalBook>{
    const book = await this.datastore.update<LocalBook>(
      `SELECT * FROM ${BOOK_TABLE_NAME} WHERE library_id = $1 AND isbn = $2 `, [libraryId, isbn],
    );
    return book;
  }
}
