import { Application } from 'express';
import IAppController from 'src/interface/controller';

export default class Router {
  constructor(app: Application, controller: IAppController) {
    app.post('/books', async (request, response, next) => {
      await controller.books.registerBook(
        { request, response, next },
      );
    });
  }
}
