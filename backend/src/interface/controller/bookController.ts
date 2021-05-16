import { wrapError } from 'src/@types';
import { UnauthorizedError } from 'src/usecases/errors';
import BookInteractor, { RegisterBookInputData } from 'src/usecases/interactor/bookInteractor';
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
      isLoan: JSON.parse(isLoan),
      isbn,
      libraryId,
      price: JSON.parse(price || '0'),
      amount: JSON.parse(amount || '0'),
      area,
      author,
      coverType,
      collection,
      coverImageUrl,
      distribuitor,
      editoral,
      pages: JSON.parse(pages || '0'),
      provider,
      subCategory,
      title,
      subTheme,
      synopsis,
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
}
