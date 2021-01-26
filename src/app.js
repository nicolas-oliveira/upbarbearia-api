import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youth from 'youch';
// import * as Sentry from '@sentry/node';

import 'express-async-errors';

// import sentryConfig from './config/sentry';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    // Sentry.init(sentryConfig); // Tratamento de exceções

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // Request handler ->
    // this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // this.server.use(Sentry.Handlers.errorHandler()); // erros do sentry
  }

  exceptionHandler() {
    this.server.use(async (err, request, response, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youth(err, request).toJSON();

        return response.status(500).json(errors);
      }
      return response.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
