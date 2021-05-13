import express from 'express';
import cors from 'cors';
import gzip from 'compression';
import { Pool } from 'pg';
import winston from 'winston';
import Registry from './registry';
import Router from './infrastructure/router/router';
import Datastore from './infrastructure/datastore/datastore';
import { wrapError } from './@types';

const app: express.Application = express();
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

const setupServer = () => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors()); // TODO: Create whitelist
  app.use(gzip());
  logger.info({
    message: 'Server setup done',
    logger: 'server:setup',
  });
};

const setupRoutes = async () => {
  const dbPool = new Pool();
  dbPool.on('error', (err) => {
    logger.error({
      message: 'Unexpected error on idle client',
      error: err,
      logger: 'server:setup',
    });
    process.exit(-1);
  });
  const [, error] = await wrapError(dbPool.query('SELECT 1 + 1 AS sum'));

  if (error) {
    logger.error({
      message: 'DB connection unsuccesfull',
      logger: 'server:setup',
      error,
    });
    throw error;
  }

  logger.info({
    message: 'DB connection succesfull',
    logger: 'server:setup',
  });

  const datastore = new Datastore(dbPool, logger);
  const registry = new Registry(datastore, logger);
  // eslint-disable-next-line no-new
  new Router(app, registry.newAppController());
};

app.listen(process.env.PORT, async () => {
  setupServer();
  await setupRoutes();
  logger.info({
    message: `Backend running on port ${process.env.PORT}`,
    logger: 'server:setup',
  });
});
