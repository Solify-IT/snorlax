import express from 'express';
import cors from 'cors';
import gzip from 'compression';
import Registry from './registry';
import Router from './infrastructure/router/router';
import Datastore from './infrastructure/datastore/datastore';

const app: express.Application = express();

const setupServer = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors()); // TODO: Create whitelist
  app.use(gzip());
  // eslint-disable-next-line no-console
  console.log('Server setup done');
};

const setupRoutes = () => {
  const datastore = new Datastore();
  const registry = new Registry(datastore);
  // eslint-disable-next-line no-new
  new Router(app, registry.newAppController());
};

app.listen(8080, async () => {
  // eslint-disable-next-line no-console
  console.log('Backend running on port 8080');
  setupServer();
  setupRoutes();
});
