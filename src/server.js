const { getLogger, getConfig } = require('boiler');
const logger = getLogger('server');

const express = require('express');
const cors = require('cors');

const storage = require('./storage');

const helloRouter = require('./routes/hello');
const { expressErrorHandler } = require('./errors');
const loggerMiddleware = require('./middlewares/logger');

let app = null;

/**
 * App is a singleton
 * getApp either initalize the application or return the active one
 */
async function getApp () {
  if (app != null) return app;
  // initstorage first
  await storage.init();

  app = express();

  app.use(cors());
  app.use(express.json());
  // enable the following to receive files
  // app.use(express.raw({ type: '*/*', limit: '10mb' }));

  // keep first
  app.use(loggerMiddleware);

  app.use('/', helloRouter);

  // ------------ must be last ------- //
  app.use(expressErrorHandler);
  return app;
}

async function launch () {
  const app = await getApp();
  const configServer = (await getConfig()).get('server');
  const port = configServer.port || 5432;
  const host = configServer.host || '127.0.0.1';
  const server = await app.listen(port, host);
  logger.info(`Listening ${host} on port ${port} in mode ${app.get('env')}`);
  return { server, app };
}

module.exports = { launch, getApp };
