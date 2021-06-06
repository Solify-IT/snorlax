import { Maybe } from 'src/@types';
import { Book, LocalBook, LocalBookInput } from 'src/domain/model';
import { ReturnMovementInput, SaleMovementInput } from 'src/domain/model/book';
import { InventoryCSV } from 'src/domain/model/catalogue';
import User from 'src/domain/model/user';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByISBN(isbn: string): Promise<LocalBook[]>;
  findById(id: string): Promise<Maybe<LocalBook>>;
  registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<LocalBook['id']>;
  updateBook(bookdata: LocalBookInput): Promise<LocalBook>;
  registerBooksSell(saleData: SaleMovementInput): Promise<void>;
  registerBookInventory(user: User, records: InventoryCSV[]): Promise<string[]>;
  registerBooksReturnEditorial(returnData: ReturnMovementInput): Promise<void>;
  findByIDsNoType(ids: string[]): Promise<any[]>;
  registerBooksReturnClient(returnData: ReturnMovementInput): Promise<void>;
  listBooksByLibrary(
    page: number, perPage: number, libraryId?: string, isbn?:string,
  ): Promise<{ localBooks: Book[], total: number }>;
}
