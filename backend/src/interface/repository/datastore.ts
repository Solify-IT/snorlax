import { Book } from 'src/domain/model';

export default interface IDatastore {
  get<T>(queryText: string, values?: any[]): Promise<T[]>;
  getById<T>(tablenName: string, id: string): Promise<T>;
  getOne<T>(queryText: string, values?: any[]): Promise<T>;
  getOneOrNull<T>(queryText: string, values?: any[]): Promise<T | null>;
  books: {
    query(queryText?: string): Promise<Book[]>;
    getByISBN(isbn: string): Promise<Book>;
  }
}
