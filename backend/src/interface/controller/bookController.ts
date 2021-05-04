import { wrapError } from 'src/@types';
import BookInteractor, { RegisterBookInputData } from 'src/usecases/interactor/bookInteractor';
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

    const bookData: RegisterBookInputData = {
      isLoan: JSON.parse(isLoan),
      isbn,
      libraryId,
      price: JSON.parse(price),
      amount: JSON.parse(amount),
      area,
      author,
      coverType,
      collection,
      coverImageUrl,
      distribuitor,
      editoral,
      pages: JSON.parse(pages),
      provider,
      subCategory,
      title,
      subTheme,
      synopsis,
      theme,
      type,
      unitaryCost: JSON.parse(unitaryCost),
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
    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const perPageNumber = perPage ? parseInt(perPage as string, 10) : undefined;
    const [books, error] = await wrapError(
      this.bookInteractor.listBooksByLibrary(
        pageNumber, perPageNumber, libraryId as string, isbn as string,
      ),
    );

    if (error) {
      context.next(error);
    }

    context.response.status(200).json({ ...books });
  }
}
