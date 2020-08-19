import * as dotenv from 'dotenv';
import * as fs from 'fs';

interface IGlobVars {
  mongoUrl: string;
  port: number;
  jwtSecret: string;
  jwtIssuer: string;
  jwtBcryptSaltRounds: number;
  aesSecret: string;
  logLevel: string;
  commentUrl: string;
}

class GlobalVars {
  constructor() {
    this.configEnv();

    this.globVars = {
      mongoUrl: process.env.MONGO_URL,
      port: Number.parseInt(process.env.PORT),
      jwtSecret: process.env.JWT_SECRET,
      jwtIssuer: process.env.JWT_ISSUER,
      jwtBcryptSaltRounds: Number.parseInt(process.env.JWT_BCRYPT_SALT_ROUNDS),
      aesSecret: process.env.AES_SECRET,
      logLevel: process.env.LOG_LEVEL,
      commentUrl: process.env.COMMENT_URL
    } as IGlobVars;
  }

  private configEnv(): void {
    try {
      if (fs.existsSync('./config/config.env')) {
        dotenv.config({ path: './config/config.env' }).parsed;
      } else {
        throw new Error('config.env not found');
      }
    } catch (err) {
      console.error(err);
      process.exit();
    }
  }

  public globVars: IGlobVars;
}

export default new GlobalVars().globVars