import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IJWTSignModel } from '../models/commonModel';
import globalVars from '../models/globalVars';

class Auth {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hashSync(password, globalVars.jwtBcryptSaltRounds);
  }

  static async encryptAES(password: string): Promise<string> {
    const AES = require("react-native-crypto-js").AES;
    const encryptedPassword = await AES.encrypt(password, globalVars.aesSecret).toString();

    return encryptedPassword;
  }

  static async decryptAES(encryptedPassword: string): Promise<string> {
    const AES = require("react-native-crypto-js").AES;
    const enc = require("react-native-crypto-js").enc;
    const bytes = await AES.decrypt(encryptedPassword, globalVars.aesSecret);
    const decryptPassword = bytes.toString(enc.Utf8);

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
