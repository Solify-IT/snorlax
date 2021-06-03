import { Maybe } from 'src/@types';
import { Book, LocalBook, LocalBookInput } from 'src/domain/model';
import { ReturnMovementInput, SaleMovementInput } from 'src/domain/model/book';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByISBN(isbn: string): Promise<LocalBook[]>;
  findById(id: string): Promise<Maybe<LocalBook>>;
  registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<LocalBook['id']>;
  updateBook(bookdata: LocalBookInput): Promise<LocalBook>;
  registerBooksSell(saleData: SaleMovementInput): Promise<void>;
  registerBooksReturn(returnData: ReturnMovementInput): Promise<void>;
  listBooksByLibrary(
    page: number, perPage: number, libraryId?: string, isbn?:string,
  ): Promise<{ localBooks: Book[], total: number }>;
}
