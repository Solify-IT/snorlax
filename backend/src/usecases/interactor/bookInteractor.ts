import { wrapError } from 'src/@types';
import { Book } from 'src/domain/model';
import { IBookPresenter, IBookRepository } from '..';

export default class BookInteractor {
  bookRepository: IBookRepository;

  bookPresenter: IBookPresenter;

  constructor(bookRepository: IBookRepository, bookPresenter: IBookPresenter) {
    this.bookRepository = bookRepository;
    this.bookPresenter = bookPresenter;
  }

  async getAll(): Promise<Book[]> {
    const [books, error] = await wrapError(this.bookRepository.findAll());

    if (error) {
      throw error;
    }

    return this.bookPresenter.findAll(books);
  }

  async getByISBN(isbn: string): Promise<Book> {
    const [book, error] = await wrapError(
      this.bookRepository.findByISBN(isbn),
    );

    if (error) {
      throw error;
    }

    return this.bookPresenter.findByISBN(book);
  }
}
