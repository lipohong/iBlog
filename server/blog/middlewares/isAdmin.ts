import { NextFunction } from 'express';
import { IERequest, IEResponse } from '../models/commonModel';

async function isAdmin(req: IERequest, res: IEResponse, next: NextFunction) {
  if (req.state.jwtPayload && req.state.jwtPayload.isAdmin) {
    return next();
  }

  return res.fail(403, 'ex_not_authenticated');
}

export default isAdmin;
