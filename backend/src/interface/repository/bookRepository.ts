/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import {
  Book, BOOK_TABLE_NAME, CATALOGUE_TABLE_NAME, LocalBook, LocalBookInput, MOVEMENT_TABLE_NAME,
} from 'src/domain/model';
import { IBookRepository } from 'src/usecases';
import { InvalidDataError } from 'src/usecases/errors';
import { Maybe } from 'src/@types';
import { SaleInput, SaleMovementInput } from 'src/domain/model/book';
import BaseRepository from './BaseRepository';

export default class BookRepository extends BaseRepository implements IBookRepository {
  async listBooksByLibrary(
    page: number, perPage: number, libraryId?: string, isbn?: string,
  ): Promise<{ localBooks: Book[], total: number }> {
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
      this.datastore.get<any>(
        `SELECT
          *,
          b.id as local_book_id,
          c.id as catalogue_id,
          b.created_at as local_book_created_at,
          c.created_at as catalogue_created_at,
          b.updated_at as local_book_updated_at,
          c.updated_at as catalogue_updated_at
        FROM
          ${BOOK_TABLE_NAME} as b,
          ${CATALOGUE_TABLE_NAME} as c
        WHERE
          c.isbn = b.isbn
          AND price > 0 ${isbn == null && libraryId != null ? ' AND library_id = $3' : ''} 
          ${isbn != null && libraryId == null ? ' AND b.isbn = $3' : ''}
          ${isbn != null && libraryId != null ? ' AND library_id = $3  AND b.isbn = $4' : ''}
        OFFSET $1 LIMIT $2`,
        valuesQuery1,
      ),
      this.datastore.get<{ count: number }>(
        `SELECT count(0) FROM ${BOOK_TABLE_NAME} WHERE price > 0 ${isbn == null && libraryId != null ? ' AND library_id = $1' : ''}  ${isbn != null && libraryId == null ? ' AND isbn = $1' : ''} ${isbn != null && libraryId != null ? ' AND library_id = $1  AND isbn = $2' : ''}`, valuesQuery2,
      ),
    ]);

    const items: Book[] = [];

    localBooks.forEach((item) => {
      items.push({
        ...item,
        updatedAt: item.localBookUpdatedAt,
        createdAt: item.localBookCreatedAt,
        id: item.localBookId,
      });
    });

    return { localBooks: items, total: total[0].count };
  }

  async registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<string> {
    const id = uuidv4();

    const result = await this.datastore.insert<LocalBookInput>(
      BOOK_TABLE_NAME, { ...bookData, id },
    );

    return result;
  }

  async registerBooksSell(saleData:Omit<SaleMovementInput, 'id'>): Promise<SaleMovementInput[]> {
    const id = uuidv4();
    return this.datastore.insertMultiple<SaleMovementInput>(MOVEMENT_TABLE_NAME, {
      ...saleData,
    });
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

  async findById(id: string): Promise<Maybe<LocalBook>> {
    const book = await this.datastore.getOneOrNull<LocalBook>(
      `SELECT * FROM  ${BOOK_TABLE_NAME} l, ${CATALOGUE_TABLE_NAME} c WHERE l.isbn = c.isbn AND l.id = $1
      `, [id],
    );
    return book;
  }
}
