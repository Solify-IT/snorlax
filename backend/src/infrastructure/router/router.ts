import { Application } from 'express';
import multer from 'multer';
import IAppController from 'src/interface/controller';
import authMiddleware from './authMiddleware';

const upload = multer({ dest: 'tmp/csv' });

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

    app.patch('/books/:id', middleware, async (request, response, next) => {
      await controller.books.updateBook(
        {
          request, response, next, logger: controller.logger,
        },
      );
    });

    app.post('/books/inventory', middleware, upload.single('file'), async (request, response, next) => {
      await controller.books.registerBookInventory(
        {
          request, response, next, logger: controller.logger,
        },
      );
    });

    app.post('/movements', middleware, async (request, response, next) => {
      await controller.movements.registerMovement(
        {
          request, response, next, logger: controller.logger,
        },
      );
    });

    app.get('/reports', middleware, async (request, response, next) => {
      await controller.movements.ReportMovements(
        {
          request, response, next, logger: controller.logger,
        },
      );
    });

    app.get('/reports/csv', middleware, async (request, response, next) => {
      await controller.movements.reportMovementsCSV(
        {
          request, response, next, logger: controller.logger,
        },
      );
    });

    app.get('/movements', middleware, async (request, response, next) => {
      await controller.movements.seeMovements(
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

    app.get('/users/:id', async (request, response, next) => {
      await controller.users.getUser({
        request, response, next, logger: controller.logger,
      });
    });

    app.delete('/users/:id', async (request, response, next) => {
      await controller.users.dropUser({
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

    app.get('/libraries/id', async (request, response, next) => {
      await controller.libraries.getLibrary({
        request, response, next, logger: controller.logger,
      });
    });

    app.patch('/libraries', async (request, response, next) => {
      await controller.libraries.updateLibrary({
        request, response, next, logger: controller.logger,
      });
    });

    app.get('/libraries', middleware, async (request, response, next) => {
      await controller.libraries.listAll({
        request, response, next, logger: controller.logger,
      });
    });
    app.get('/todaySale', middleware, async (request, response, next) => {
      await controller.movements.getTodaySale({
        request, response, next, logger: controller.logger,
      });
    });

    app.post('/libraries', async (request, response, next) => {
      await controller.libraries.createLibrary({
        request, response, next, logger: controller.logger,
      });
    });

    app.post('/libraries/sell', async (request, response, next) => {
      await controller.books.registerBooksSell({
        request, response, next, logger: controller.logger,
      });
    });

    app.post('/libraries/return-editorial', async (request, response, next) => {
      await controller.books.registerBookReturnEditorial({
        request, response, next, logger: controller.logger,
      });
    });

    app.post('/libraries/return-cliente', async (request, response, next) => {
      await controller.books.registerBookReturnClient({
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
