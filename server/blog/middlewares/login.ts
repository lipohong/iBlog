import * as passport from 'passport';
import { NextFunction } from 'express';
import { IERequest, IEResponse } from '../models/commonModel';

function login(req: IERequest, res: IEResponse, next: NextFunction) {
  passport.authenticate('login', async (err, token, info) => {
    if (err) {
      return res.throwErr(err);
    } else if (info) {
      return res.fail(400, info.message);
    } else if (token) {
      return res.success(null, token);
    }
  })(req, res, next)
}

export default login