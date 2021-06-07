/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import {
  Book, BOOK_TABLE_NAME, CATALOGUE_TABLE_NAME, LIBRARY_TABLE_NAME,
  LocalBook, LocalBookInput, Movement,
  MOVEMENT_TABLE_NAME,
} from 'src/domain/model';
import User from 'src/domain/model/user';
import { IBookRepository } from 'src/usecases';
import { InvalidDataError } from 'src/usecases/errors';
import { Maybe } from 'src/@types';
import { ReturnMovementInput, SaleMovementInput } from 'src/domain/model/book';
import { InventoryCSV } from 'src/domain/model/catalogue';
import BaseRepository from './BaseRepository';
import CatalogueRepository from './catalogueRepository';
import IDatastore from './datastore';

export default class BookRepository extends BaseRepository implements IBookRepository {
  async registerBooksReturnClient(returnData: ReturnMovementInput): Promise<void> {
    let id = uuidv4();
    for (const book of returnData.books) {
      this.datastore.insert<Movement>(MOVEMENT_TABLE_NAME, {
        localBookId: book.id, amount: book.amount, isLoan: false, total: book.total, id, type: 'Devolucion cliente',
      });
      id = uuidv4();
    }
  }

  async listBooksByLibrary(
    page: number, perPage: number, libraryId?: string, isbn?: string,
  ): Promise<{ localBooks: Book[], total: number }> {
    if (page <= 0) throw new InvalidDataError('Page is less than one!');

    // Case Library not null isbn null
    let valuesQuery1 = [(page - 1) * perPage, perPage, libraryId];
    let valuesQuery2 = [libraryId];

    // Case Library not null isbn not null
    if (isbn != null && libraryId == null) {
      // eslint-disable-next-line no-param-reassign
      isbn = `%${isbn}%`;
      valuesQuery1 = [(page - 1) * perPage, perPage, isbn];
      valuesQuery2 = [isbn];
    }

    // Case Library not null isbn not null
    if (isbn != null && libraryId != null) {
      // eslint-disable-next-line no-param-reassign
      isbn = `%${isbn}%`;
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
          c.updated_at as catalogue_updated_at,
          l.name as library_name,
          l.phone_number as library_phone
        FROM
          ${BOOK_TABLE_NAME} as b,
          ${CATALOGUE_TABLE_NAME} as c,
          ${LIBRARY_TABLE_NAME} as l
        WHERE
          c.isbn = b.isbn
          AND l.id = b.library_id
          AND price > 0 ${isbn == null && libraryId != null ? ' AND library_id = $3' : ''} 
          ${isbn != null && libraryId == null ? ' AND (b.isbn ILIKE $3 OR c.author ILIKE $3 OR c.title ILIKE $3 OR c.area ILIKE $3 OR c.theme ILIKE $3)' : ''}
          ${isbn != null && libraryId != null ? ' AND library_id = $3  AND (b.isbn ILIKE $4 OR c.author ILIKE $4 OR c.title ILIKE $4 OR c.area ILIKE $4 OR c.theme ILIKE $4)' : ''}
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

  async registerBookWithID(bookData: LocalBookInput): Promise<string> {
    const result = await this.datastore.insert<LocalBookInput>(
      BOOK_TABLE_NAME, bookData,
    );

    return result;
  }

  async registerBookInventory(
    user: User, records: InventoryCSV[],
  ): Promise<{ ids: string[], updatedRecords: InventoryCSV[] }> {
    const recordIdsSQL = records.map((record) => `'${record.ISBN}'`).join(', ');
    // Search for ISBNs in DB
    const isbnsFoundInLibrary = await this.datastore.get<any>(
      `SELECT * from local_books where isbn in (${recordIdsSQL}) and library_id = '${user.libraryId}'`,
    );

    const recordsFoundInLibrary: InventoryCSV[] = [];
    let recordsNotFoundInLibrary: InventoryCSV[] = [];
    records.forEach((record) => {
      const found = isbnsFoundInLibrary.find((element) => element.isbn === record.ISBN);
      if (found !== undefined) {
        const newAmount = parseInt(record.EXISTENCIA, 10) + parseInt(found.amount, 10);
        recordsFoundInLibrary
          .push({
            ...record,
            id: found.id,
            amount: newAmount,
          });
      } else {
        recordsNotFoundInLibrary.push({
          ...record,
          amount: parseInt(record.EXISTENCIA, 10),
        });
      }
    });

    // Insert into local_books the recordsNotFoundInLibrary
    const insertOperations: Promise<string>[] = [];
    recordsNotFoundInLibrary = recordsNotFoundInLibrary
      .map((el) => ({ ...el, id: uuidv4() }));
    recordsNotFoundInLibrary.forEach((record) => {
      insertOperations.push(this.registerBookWithID({
        id: record.id,
        isbn: record.ISBN,
        price: Number.parseFloat(record.PRECIO),
        libraryId: user.libraryId,
        amount: record.amount,
      }));
    });

    const updateOperations: any[] = [];
    // Update on local_books the recordsFoundInLibrary
    recordsFoundInLibrary.forEach((record) => {
      updateOperations.push(this.updateExistingBook({
        id: record.id as string,
        isbn: record.ISBN,
        price: Number.parseFloat(record.PRECIO),
        libraryId: user.libraryId,
        amount: record.amount,
      }));
    });
    await Promise.all(updateOperations);
    const inserts = await Promise.all(insertOperations);

    return {
      ids: [
        ...recordsFoundInLibrary.map((record) => record.id as string),
        ...inserts,
      ],
      updatedRecords: [...recordsFoundInLibrary, ...recordsNotFoundInLibrary],
    };
  }

  async registerBooksSell(saleData: SaleMovementInput): Promise<void> {
    let id = uuidv4();
    for (const book of saleData.books) {
      this.datastore.insert<Movement>(MOVEMENT_TABLE_NAME, {
        localBookId: book.id, amount: book.amount, isLoan: false, total: book.total, id, type: 'Venta',
      });
      id = uuidv4();
    }
  }

  async registerBooksReturnEditorial(returnData: ReturnMovementInput): Promise<void> {
    let id = uuidv4();
    for (const book of returnData.books) {
      this.datastore.insert<Movement>(MOVEMENT_TABLE_NAME, {
        localBookId: book.id, amount: book.amount, isLoan: false, total: book.total, id, type: 'Devolucion Editorial',
      });
      id = uuidv4();
    }
  }

  findAll(): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }

  async findByIDsNoType(ids: string[]): Promise<any[]> {
    const books = await this.datastore.get<any>(
      `SELECT * FROM  ${BOOK_TABLE_NAME} WHERE id in ${`(${ids.map((id) => `'${id}'`).join(', ')})`}`,
    );

    return books;
  }

  async findById(id: string): Promise<Maybe<LocalBook>> {
    const book = await this.datastore.getOneOrNull<any>(
      `SELECT *, c.id as cId, l.id as id FROM  ${BOOK_TABLE_NAME} l, ${CATALOGUE_TABLE_NAME} c WHERE l.isbn = c.isbn AND l.id = $1
      `, [id],
    );

    return book;
  }

  async findByISBN(isbn: string): Promise<LocalBook[]> {
    const books = await this.datastore.get<LocalBook>(
      `SELECT * FROM ${BOOK_TABLE_NAME} WHERE isbn = $1`, [isbn],
    );

    return books;
  }

  async updateBook(bookData: LocalBook): Promise<LocalBook> {
    const book = await this.datastore.update<LocalBook, LocalBook>(
      BOOK_TABLE_NAME,
      `id = '${bookData.id}'`,
      bookData,
    );
    return book;
  }

  async updateExistingBook(bookData: Omit<LocalBook, 'library'>): Promise<LocalBook> {
    const book = await this.datastore.update<any, any>(
      BOOK_TABLE_NAME,
      `id = '${bookData.id}'`,
      bookData,
    );
    return book;
  }
}
