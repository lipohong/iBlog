import * as passport from 'passport';
import { NextFunction } from 'express';
import { IERequest, IEResponse, IJWTPayloadModel } from '../models/commonModel';

async function auth(req: IERequest, res: IEResponse, next: NextFunction) {
  let execAuth = (req: IERequest, res: IEResponse): Promise<IJWTPayloadModel> => {
    return new Promise((resolve, reject) => {
      passport.authenticate('authenicate', (err, user: IJWTPayloadModel) => {
        if (err) {
          return reject(new Error(err));
        }
        else if (!user) {
          return reject(new Error('ex_not_authenticated'));
        }

        return resolve(user);
      })(req, res)
    });
  }

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const jwtPayload = await execAuth(req, res);

      if (jwtPayload) {
        req.state.jwtPayload = jwtPayload;
        return next();
      }
    }

    return res.fail(400, 'ex_not_authenticated');
  }
  catch (err) {
    return res.fail(400, 'ex_not_authenticated');
  }
}

export default auth