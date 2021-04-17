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
    libraryId: string, page: number, perPage: number,
  ): Promise<{ localBooks: LocalBook[], total: number }> {
    if (page <= 0) throw new InvalidDataError('Page is less than one!');
    const [localBooks, total] = await Promise.all([
      this.datastore.get<LocalBook>(
        `SELECT * FROM ${BOOK_TABLE_NAME} WHERE library_id = $1 OFFSET $2 LIMIT $3`,
        [libraryId, (page - 1) * perPage, perPage],
      ),
      this.datastore.get<{ count: number }>(
        `SELECT count(0) FROM ${BOOK_TABLE_NAME} WHERE library_id = $1`, [libraryId],
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
