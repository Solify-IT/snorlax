import { Application } from 'express';
import IAppController from 'src/interface/controller';

export default class Router {
  constructor(app: Application, controller: IAppController) {
    app.post('/books', async (request, response, next) => {
      await controller.books.registerBook(
        { request, response, next },
      );
    });

    app.get('/books', async (request, response, next) => {
      await controller.books.listBooksByLibrary(
        { request, response, next },
      );
    });
    app.get('/books/:bookId', async (request, response, next) => {
      await controller.books.getBookbyId(
        { request, response, next },
      );
    });
  }
}
