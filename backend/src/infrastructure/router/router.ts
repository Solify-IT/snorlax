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

    app.get('/users/roles', async (request, response, next) => {
      await controller.users.listAllRoles({ request, response, next });
    });

    app.get('/users', async (request, response, next) => {
      await controller.users.listUsers({ request, response, next });
    });

    app.post('/users', async (request, response, next) => {
      await controller.users.createUser({ request, response, next });
    });
    app.put('/users', async (request, response, next) => {
      await controller.users.updateUser({ request, response, next });
    });

    app.get('/libraries', async (request, response, next) => {
      await controller.libraries.listAll({ request, response, next });
    });
  }
}
