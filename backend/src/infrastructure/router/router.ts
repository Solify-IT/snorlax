import { Application } from 'express';
import IAppController from 'src/interface/controller';
import authMiddleware from './authMiddleware';

export default class Router {
  constructor(app: Application, controller: IAppController) {
    const middleware = authMiddleware(controller.users.userInteractor.userRepository);
    app.post('/books', middleware, async (request, response, next) => {
      await controller.books.registerBook(
        {
          request, response, next, logger: controller.logger,
        },
      );
    });

    app.get('/books', middleware, async (request, response, next) => {
      await controller.books.listBooksByLibrary(
        {
          request, response, next, logger: controller.logger,
        },
      );
    });

    app.get('/books/:bookId', middleware, async (request, response, next) => {
      await controller.books.getBookById(
        {
          request, response, next, logger: controller.logger,
        },
      );
    });

    app.get('/users/roles', middleware, async (request, response, next) => {
      await controller.users.listAllRoles({
        request, response, next, logger: controller.logger,
      });
    });

    app.post('/users/sign-in', async (request, response, next) => {
      await controller.users.signIn({
        request, response, next, logger: controller.logger,
      });
    });

    app.get('/users/id', async (request, response, next) => {
      await controller.users.getUser({
        request, response, next, logger: controller.logger,
      });
    });

    app.get('/users', middleware, async (request, response, next) => {
      await controller.users.listUsers({
        request, response, next, logger: controller.logger,
      });
    });
    app.patch('/users', async (request, response, next) => {
      await controller.users.updateUser({
        request, response, next, logger: controller.logger,
      });
    });

    app.post('/users', middleware, async (request, response, next) => {
      await controller.users.createUser({
        request, response, next, logger: controller.logger,
      });
    });

    app.get('/libraries', middleware, async (request, response, next) => {
      await controller.libraries.listAll({
        request, response, next, logger: controller.logger,
      });
    });

    app.post('/libraries', async (request, response, next) => {
      await controller.libraries.createLibrary({
        request, response, next, logger: controller.logger,
      });
    });

    app.post('/books/sell', async (request, response, next) => {
      await controller.books.registerBooksSell({
        request, response, next, logger: controller.logger,
      });
    });

    app.get('/catalogue/:isbn', middleware, async (request, response, next) => {
      await controller.catalogue.findByISBNOrNull({
        request, response, next, logger: controller.logger,
      });
    });
  }
}
