import { Application } from 'express';
import { wrapError } from 'src/@types';
import IAppController from 'src/interface/controller';

export default class Router {
  constructor(app: Application, controller: IAppController) {
    app.get('/books', async (request, response, next) => {
      await wrapError(
        controller.books.getBooks(
          { request, response, next },
        ),
      );
    });

    app.get('/books/:isbn', async (request, response, next) => {
      await wrapError(
        controller.books.getBookByISBN(
          { request, response, next },
        ),
      );
    });
  }
}
