import axios from 'axios';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { IERequest, IEResponse, IJWTSignModel } from '../models/commonModel';
import globVars from '../models/globalVars';
import FacebookLoginModel from '../models/user/class/facebookLoginModel';
import { getUser, getMyInfo, saveNewUser, updateUser, getUsers } from '../services/userService';
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
        registerPage: globVars.registerPage,
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

      const decryptPassword = await Auth.decryptAES(userModel.password);
      userModel.password = await Auth.hashPassword(decryptPassword);
      if (!user) {
        await saveNewUser(userModel);
      } else {
        await updateUser({ _id: user._id }, { verifyCode, password: userModel.password, username: userModel.username })
      }

      return res.success("msg_register_verify_email_sent", null);
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
      const user = await getUser({ email: userModel.email, isActived: true, isDeleted: false });
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
        username: user.username,
        resetPasswordPage: globVars.resetPasswordPage,
        verifyCode
      });
      const message = {
        from: globVars.emailFrom,
        to: user.email,
        subject: "[iBlog] Reset password comfirmation",
        html
      }
      await transporter.sendMail(message);
      transporter.close();

      await updateUser({ _id: user._id }, { verifyCode })

      return res.success("msg_verify_code_email_sent", null);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public sendNewPasswordEmail = async (req: IERequest, res: IEResponse) => {
    try {
      const userModel = new UserModel(req.body, 'post');
      if (!userModel.email) {
        throw new Error("ex_no_email");
      }
      const user = await getUser({ email: userModel.email, isActived: true, isDeleted: false });
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
      const html = await ejs.renderFile('views/resetPasswordBody.ejs', {
        username: user.username,
        resetPasswordPage: globVars.resetPasswordPage,
        verifyCode
      });
      const message = {
        from: globVars.emailFrom,
        to: user.email,
        subject: "[iBlog] Reset password comfirmation",
        html
      }
      await transporter.sendMail(message);
      transporter.close();

      await updateUser({ _id: user._id }, { verifyCode })

      return res.success("msg_verify_code_email_sent", null);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public registerVerify = async (req: IERequest, res: IEResponse) => {
    try {
      const userModel = new UserModel(req.body, 'post');
      if (!userModel.email) {
        throw new Error("ex_no_email");
      }
      if (!userModel.verifyCode) {
        throw new Error("ex_no_verifyCode");
      }
      const user = await getUser({ email: userModel.email, verifyCode: userModel.verifyCode });
      if (!user) {
        throw new Error('ex_wrong_verifyCode');
      } else {
        await updateUser({ _id: user._id }, { verifyCode: null, isActived: true });
      }

      return res.success("register_sueccess", { email: user.email });
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public resetPasswordVerify = async (req: IERequest, res: IEResponse) => {
    try {
      const userModel = new UserModel(req.body, 'post');
      if (!userModel.email) {
        throw new Error("ex_no_email");
      }
      if (!userModel.verifyCode) {
        throw new Error("ex_no_verifyCode");
      }
      if (!userModel.password) {
        throw new Error("ex_no_password");
      }
      const user = await getUser({ email: userModel.email, verifyCode: userModel.verifyCode });
      if (!user) {
        throw new Error('ex_wrong_verifyCode')
      } else {
        const decryptPassword = await Auth.decryptAES(userModel.password);
        userModel.password = await Auth.hashPassword(decryptPassword);
        await updateUser({ _id: user._id }, { password: userModel.password, verifyCode: null })
      }

      return res.success("msg_reset_password_success", null);
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
        resetPasswordPage: globVars.resetPasswordPage,
        registerPage: globVars.registerPage,
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

      return res.success(null, new UserModel(userInfo, 'fetch'));
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

  public getUserByIds = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: { $in: req.body } };
      const userInfoList = await getUsers(expression);

      return res.success(null, userInfoList.map(userInfo => (new UserModel(userInfo, 'fetch'))));
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
      const user = await getUser({ email: facebookField.email, isActived: true, isDeleted: false });
      if (!user) {
        throw new Error('ex_user_not_exists');
      }
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

  public update = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.state.jwtPayload.userId, isActived: true, isDeleted: false };
      let user = await getUser(expression);
      if (!user) {
        throw new Error('ex_user_not_exists');
      }
      const model = new UserModel(req.body, 'update');
      user = await updateUser(expression, model);

      return res.success("msg_update_user_info_success", new UserModel(user, 'fetch'));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}