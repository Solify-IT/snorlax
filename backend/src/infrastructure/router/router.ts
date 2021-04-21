import { Application } from 'express';
import IAppController from 'src/interface/controller';

export default class Router {
  constructor(app: Application, controller: IAppController) {
    app.post('/books', async (request, response, next) => {
      await controller.books.registerBook(
        { request, response, next },
      );
    });
<<<<<<< HEAD
    app.get('/books/:bookId', async (request, response, next) => {
      await controller.books.getBookbyId(
=======

    app.get('/books', async (request, response, next) => {
      await controller.books.listBooksByLibrary(
>>>>>>> 0df92ea3b153dcced5774eb4daa276439dbc0f66
        { request, response, next },
      );
    });
  }
}
