import * as fs from 'fs';
import { wrapError } from 'src/@types';
import parse from 'csv-parse/lib/sync';
import { SaleMovementInput, ReturnMovementInput } from 'src/domain/model/book';
import { UnauthorizedError } from 'src/usecases/errors';
import BookInteractor, { RegisterBookInputData } from 'src/usecases/interactor/bookInteractor';
import { InventoryCSV } from 'src/domain/model/catalogue';
import { isAdmin, isLibrero } from '../auth';
import { IContext } from './context';

export default class BookController {
  bookInteractor: BookInteractor;

  constructor(bookInteractor: BookInteractor) {
    this.bookInteractor = bookInteractor;
  }

  // POST /books { bookData }
  async registerBook(context: IContext): Promise<void> {
    const {
      isLoan,
      isbn,
      libraryId,
      price,
      amount,
      area,
      author,
      coverType,
      collection,
      coverImageUrl,
      distribuitor,
      editoral,
      pages,
      provider,
      subCategory,
      title,
      subTheme,
      synopsis,
      libraryName,
      libraryPhone,
      theme,
      type,
      unitaryCost,
    } = context.request.body;
    const { currentUser } = context.request;

    // Only admins or libreros of the same library can register books
    if (
      !isAdmin(currentUser.role.name)
      && !(
        isLibrero(currentUser.role.name)
        && currentUser.libraryId === libraryId
      )
    ) {
      const MESSAGE = 'Permisos insuficientes.';
      context.logger.error({ message: MESSAGE });
      throw new UnauthorizedError(MESSAGE);
    }

    const bookData: RegisterBookInputData = {
      isLoan: JSON.parse(isLoan || false),
      isbn,
      libraryId,
      price: JSON.parse(price || 0),
      amount: parseInt(JSON.parse(amount || 0), 10),
      area,
      author,
      coverType,
      collection,
      coverImageUrl,
      distribuitor,
      editoral,
      pages: JSON.parse(pages || 0),
      provider,
      subCategory,
      title,
      subTheme,
      synopsis,
      libraryName,
      libraryPhone,
      theme,
      type,
      unitaryCost: JSON.parse(unitaryCost || '0'),
    };

    const [id, error] = await wrapError(
      this.bookInteractor.registerBook(bookData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ id });
  }

  // POST /books/movement { movementData }
  async registerBooksSell(context: IContext): Promise<void> {
    const {
      books,
    } = context.request.body as SaleMovementInput;

    const saleData: SaleMovementInput = {
      books,
    };

    const [, error] = await wrapError(
      this.bookInteractor.registerBooksSell(saleData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ status: 200 });
  }

  async registerBookInventory(context: IContext): Promise<void> {
    const {
      file,
    } = context.request;

    fs.readFile(file.path, 'utf8', async (err, data) => {
      if (err) {
        context.response.status(500).json({ status: 500 });
        return;
      }
      const records: InventoryCSV[] = parse(data, {
        columns: true,
        skipEmptyLines: true,
      });

      const [, error] = await wrapError(
        this.bookInteractor.registerBookInventory(context.request.currentUser, records),
      );
      if (error) {
        context.next(error);
        return;
      }

      context.response.status(201).json({ data: records });
    });
  }

  async registerBookReturnEditorial(context: IContext): Promise<void> {
    const {
      books,
    } = context.request.body as ReturnMovementInput;
    const returnData: ReturnMovementInput = {
      books,
    };
    const [, error] = await wrapError(
      this.bookInteractor.registerBooksReturnEditorial(returnData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ status: 200 });
  }

  async registerBookReturnClient(context: IContext): Promise<void> {
    const {
      books,
    } = context.request.body as ReturnMovementInput;
    const returnData: ReturnMovementInput = {
      books,
    };
    const [, error] = await wrapError(
      this.bookInteractor.registerBooksReturnClient(returnData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ status: 200 });
  }

  // recibe GET /books?libraryId=<?>&isbn=<?>
  async listBooksByLibrary(context: IContext): Promise<void> {
    const {
      page, perPage, libraryId, isbn,
    } = context.request.query;
    const { currentUser } = context.request;

    // Only admins or libreros can list books
    if (
      !isAdmin(currentUser.role.name)
      && !isLibrero(currentUser.role.name)
    ) {
      const MESSAGE = 'Permisos insuficientes.';
      context.logger.error({ MESSAGE });
      throw new UnauthorizedError(MESSAGE);
    }

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const perPageNumber = perPage ? parseInt(perPage as string, 10) : undefined;
    const [books, error] = await wrapError(
      this.bookInteractor.listBooksByLibrary(
        pageNumber, perPageNumber, libraryId as string, isbn as string,
      ),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ ...books });
  }

  async getBookById(context: IContext): Promise<void> {
    const { bookId } = context.request.params;
    const [book, error] = await wrapError(
      this.bookInteractor.getBook(bookId as string),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ book });
  }

  async updateBook(context: IContext): Promise<void> {
    const {
      id,
      isbn,
      price,
      libraryId,
      amount,
    } = context.request.body;

    const bookData = {
      id,
      isbn,
      price,
      libraryId,
      amount: parseInt(JSON.parse(amount || '0'), 10),
    };

    const [idd, error] = await wrapError(
      this.bookInteractor.updateBookAmount(bookData),
    );
    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ idd });
  }
}
