import { NextFunction } from 'express';
import { IERequest, IEResponse } from '../models/commonModel';

function iReview() {
  return (req: IERequest, res: IEResponse, next: NextFunction) => {
    let obj = {
      isDeleted: false,
    }

    req.restriction = obj;

    return next();
  }
}

export { iReview };
