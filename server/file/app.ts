import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as passport from 'passport';

import * as userAgent from 'express-useragent';

import { userRoute } from './routes/fileRoute';

import { IERequest, IEResponse, ReqStateModel, IRoute, StandardResponse } from './models/commonModel';

import Logger from './utils/logger';

import './utils/passport';

class App {

  public app: express.Application = express();
  public routes: IRoute[] = [
    new userRoute()
  ];

  constructor() {
    this.config();

    this.routeConfig();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json({limit: '50mb'}));
    this.app.use(bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit:50000
    }));
    this.app.use(passport.initialize());
    this.app.use(userAgent.express());

    // undefined values are set to `null`
    this.app.set('json replacer', function (key, value) {
      if (typeof value === 'undefined') {
        return null;
      }
      return value;
    });

    this.app.use((err, req, res, next) => {
      Logger.loggerInstance.error({
        id: req.id,
        err,
      }, 'error');
      res.status(500).send(`Trace ID: ${req.id}`);
    });

    this.app.use((req: IERequest, res: IEResponse, next) => {
      req.state = new ReqStateModel();

      res.success = (message?: string, payload?: object) => {
        res.status(200).json({
          message: message,
          payload: payload
        } as StandardResponse);
      }

      res.throwErr = (err) => {
        Logger.loggerInstance.error(err);

        if (err[0] && err[0].constructor.name === 'ValidationError') {
          return res.status(400).json({
            message: Object.values(err[0].constraints)[0],
            payload: null
          } as StandardResponse);
        }

        return res.status(400).json({
          message: err.message || 'ex_internal_server_error',
          payload: null
        } as StandardResponse);
      }

      res.fail = (errStatus?: number, errMsg?: string) => {
        const status = errStatus || 400;
        const message = errMsg || 'ex_internal_server_error';

        return res.status(status).json({
          message: message,
          payload: null
        } as StandardResponse);
      }
      next();
    });
  }

  private routeConfig(): void {
    this.routes.forEach((r: IRoute): void => r.routes(this.app));
  }

}

export default new App().app;
