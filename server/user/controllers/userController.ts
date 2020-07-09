import { IERequest, IEResponse } from '../models/commonModel';

import { getUserById, getMyInfo } from '../services/userService';

export class UserController {

  public getMyInfo = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.state.jwtPayload.userId };
      const userInfo = await getMyInfo(expression);   

      return res.success(null, userInfo);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getUserById = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.userId };
      const userInfo = await getUserById(expression);   

      return res.success(null, userInfo);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}