import axios from 'axios';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { IERequest, IEResponse, IJWTSignModel } from '../models/commonModel';
import globVars from '../models/globalVars';
import FacebookLoginModel from '../models/user/class/facebookLoginModel';
import { getUser, getMyInfo, saveNewUser, updateUser } from '../services/userService';
import UserModel from '../models/user/class/userModel';
import Auth from '../utils/auth';

let ejs = require('ejs');

export class UserController {

  public sendVerifyEmail = async (req: IERequest, res: IEResponse) => {
    try {
      const userModel = new UserModel(req.body, 'post');
      if (!userModel.email) {
        throw new Error("ex_no_email");
      }
      if (!userModel.password) {
        throw new Error("ex_no_password");
      }
      if (!userModel.username) {
        throw new Error("ex_no_username");
      }
      const user = await getUser({ email: userModel.email });
      if (!!user && user.isActived) {
        throw new Error("ex_user_already_exists");
      }
      const verifyCode = uuidv4().slice(0, 8);
      userModel.verifyCode = verifyCode;
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        tls: { ciphers: 'SSLv3' },
        auth: {
          user: globVars.emailUser,
          pass: globVars.emailPass
        }
      });
      const html = await ejs.renderFile('views/registerBody.ejs', {
        username: userModel.username,
        email: userModel.email,
        verifyCode
      });
      const message = {
        from: globVars.emailFrom,
        to: userModel.email,
        subject: "[iBlog] Register comfirmation",
        html
      }
      const info = await transporter.sendMail(message);
      transporter.close();

      if (!user) {
        const decryptPassword = await Auth.decryptAES(userModel.password);
        userModel.password = await Auth.hashPassword(decryptPassword);
        await saveNewUser(userModel);
      } else {
        await updateUser({ _id: userModel._id }, { verifyCode })
      }

      return res.success(null, info['envelope']);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public sendForgetPasswordEmail = async (req: IERequest, res: IEResponse) => {
    try {
      const userModel = new UserModel(req.body, 'post');
      if (!userModel.email) {
        throw new Error("ex_no_email");
      }
      const user = await getUser({ email: userModel.email, isActived: true });
      if (!user) {
        throw new Error("ex_user_not_exists");
      }
      const verifyCode = uuidv4().slice(0, 8);
      userModel.verifyCode = verifyCode;
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        tls: { ciphers: 'SSLv3' },
        auth: {
          user: globVars.emailUser,
          pass: globVars.emailPass
        }
      });
      const html = await ejs.renderFile('views/forgetPasswordBody.ejs', {
        username: userModel.username,
        email: userModel.email,
        verifyCode
      });
      const message = {
        from: globVars.emailFrom,
        to: userModel.email,
        subject: "[iBlog] Reset password comfirmation",
        html
      }
      const info = await transporter.sendMail(message);
      transporter.close();

      await updateUser({ _id: userModel._id }, { verifyCode })

      return res.success(null, info['envelope']);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public registerVerify = async (req: IERequest, res: IEResponse) => {
    try {
      const verifyCode = req.params.verifyCode;
      const user = await getUser({ verifyCode });
      if (!user) {
        throw new Error('ex_user_not_found')
      } else {
        await updateUser({ _id: user._id }, { verifyCode: null, isActived: true })
      }

      return res.success(null, { email: user.email });
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public forgetPasswordVerify = async (req: IERequest, res: IEResponse) => {
    try {
      // const verifyCode = req.params.verifyCode;
      // const user = await getUser({ verifyCode });
      // if (!user) {
      //   throw new Error('ex_user_not_found')
      // } else {
      //   await updateUser({ _id: user._id }, { verifyCode: null, isActived: true })
      // }

      return res.success(null, null);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public emailView = async (req: IERequest, res: IEResponse) => {
    try {
      const html = await ejs.renderFile('views/forgetPasswordBody.ejs', {
        username: "userModel.username",
        email: "userModel.email",
        verifyCode: "verifyCode"
      }); 

      return res.send(html);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

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
      const userInfo = await getUser(expression);
      if (!userInfo) {
        throw new Error('ex_cannot_find_user');
      }

      return res.success(null, new UserModel(userInfo, 'fetch'));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public loginThroughFacebook = async (req: IERequest, res: IEResponse) => {
    try {
      const facebookField = new FacebookLoginModel(req.body, 'post');
      const { data } = await axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`);
      const appToken = data.access_token;
      const result = await axios.get(`https://graph.facebook.com/debug_token?input_token=${facebookField.accessToken}&access_token=${appToken}`);
      if (!_.get(result, 'data.data.is_valid')) {
        throw new Error('ex_accessToken_not_valid');
      }
      const user = await getUser({ email: facebookField.email });
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