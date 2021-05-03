/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import {
  Book, BOOK_TABLE_NAME, LocalBook, LocalBookInput,
} from 'src/domain/model';
import { IBookRepository } from 'src/usecases';
import { InvalidDataError } from 'src/usecases/errors';
import IDatastore from './datastore';

export default class BookRepository implements IBookRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  // regresar
  async listBooksByLibrary(
    page: number, perPage: number, libraryId?: string, isbn?: string,
  ): Promise<{ localBooks: LocalBook[], total: number }> {
    if (page <= 0) throw new InvalidDataError('Page is less than one!');
    // Case Library not null isbn null
    let valuesQuery1 = [(page - 1) * perPage, perPage, libraryId];
    let valuesQuery2 = [libraryId];
    // Case Library not null isbn not null
    if (isbn != null && libraryId == null) {
      valuesQuery1 = [(page - 1) * perPage, perPage, isbn];
      valuesQuery2 = [isbn];
    }
    // Case Library not null isbn not null
    if (isbn != null && libraryId != null) {
      valuesQuery1 = [(page - 1) * perPage, perPage, libraryId, isbn];
      valuesQuery2 = [libraryId, isbn];
    }
    const [localBooks, total] = await Promise.all([

      this.datastore.get<LocalBook>(
        `SELECT * FROM ${BOOK_TABLE_NAME} WHERE price > 0 ${isbn == null && libraryId != null ? ' AND library_id = $3' : ''}  ${isbn != null && libraryId == null ? ' AND isbn = $3' : ''} ${isbn != null && libraryId != null ? ' AND library_id = $3  AND isbn = $4' : ''} OFFSET $1 LIMIT $2`,
        valuesQuery1,
      ),
      this.datastore.get<{ count: number }>(
        `SELECT count(0) FROM ${BOOK_TABLE_NAME} WHERE price > 0 ${isbn == null && libraryId != null ? ' AND library_id = $1' : ''}  ${isbn != null && libraryId == null ? ' AND isbn = $1' : ''} ${isbn != null && libraryId != null ? ' AND library_id = $1  AND isbn = $2' : ''}`, valuesQuery2,
      ),
    ]);
    return { localBooks, total: total[0].count };
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
