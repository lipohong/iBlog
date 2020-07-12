import * as axios from 'axios';
import * as _ from 'lodash';
import { IERequest, IEResponse, IJWTSignModel } from '../models/commonModel';
import FacebookLoginModel from '../models/user/class/facebookLoginModel';
import { getUserById, getUserByEmail, getMyInfo } from '../services/userService';
import Auth from '../utils/auth';

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

  public loginThroughFacebook = async (req: IERequest, res: IEResponse) => {
    try {
      const facebookField = new FacebookLoginModel(req.body, 'post');
      const { data } = await axios.default.get(`https://graph.facebook.com/oauth/access_token?\
      client_id=${process.env.FACEBOOK_APP_ID}\
      &client_secret=${process.env.FACEBOOK_APP_SECRET}\
      &grant_type=client_credentials`);
      const appToken = data.access_token;
      const result = await axios.default.get(`https://graph.facebook.com/debug_token?\
      input_token=${facebookField.accessToken}\
      &access_token=${appToken}`);
      if (!_.get(result, 'data.data.is_valid')) {
        throw new Error('ex_accessToken_not_valid');
      }
      const user = await getUserByEmail({ email: facebookField.email });
      const token = Auth.signLoginToken({
        userId: user._id,
        username: user.username
      } as IJWTSignModel);

      return res.success(null, {
        userId: user._id,
        username: user.username,
        jwt: token
      });
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}