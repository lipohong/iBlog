import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import { IJWTSignModel } from '../models/commonModel';
import globalVars from '../models/globalVars';

class Auth {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hashSync(password, globalVars.jwtBcryptSaltRounds);
  }

  static async encryptAES(password: string): Promise<string> {
    const encryptedPassword = await crypto.AES.encrypt(password, globalVars.aesSecret).toString();

    return encryptedPassword;
  }

  static async decryptAES(encryptedPassword: string): Promise<string> {
    const bytes = crypto.AES.decrypt(encryptedPassword, globalVars.aesSecret);
    const decryptPassword = bytes.toString(crypto.enc.Utf8);

    if (!decryptPassword) {
      throw new Error('ex_incorrect_password');
    }

    return decryptPassword;
  }

  static async comparePassword(bodypassword: string, userpassword: string): Promise<boolean> {
    return await bcrypt.compareSync(bodypassword, userpassword);
  }

  static signLoginToken(jwtSignModel: IJWTSignModel): string {
    let token = jwt.sign(jwtSignModel, globalVars.jwtSecret, {
      issuer: globalVars.jwtIssuer
    });

    return token;
  }
}

export default Auth;
