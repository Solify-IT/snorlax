import { Maybe } from 'src/@types';
import { Book, LocalBook, LocalBookInput } from 'src/domain/model';
import { SaleMovementInput } from 'src/domain/model/book';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByISBN(isbn: string): Promise<LocalBook[]>;
  findById(id: string): Promise<Maybe<LocalBook>>;
  registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<LocalBook['id']>;
  registerBooksSell(saleData: SaleMovementInput): Promise<void>;
  listBooksByLibrary(
    page: number, perPage: number, libraryId?: string, isbn?:string,
  ): Promise<{ localBooks: Book[], total: number }>;
}
