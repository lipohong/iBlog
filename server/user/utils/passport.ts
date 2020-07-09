import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as passportJWT from 'passport-jwt';
import Auth from './auth';

import { getUserByEmail } from '../services/userService';
import { IJWTPayloadModel, IJWTSignModel } from '../models/commonModel';
import globalVars from '../models/globalVars';

const LocalStrategy = passportLocal.Strategy;
const JWTstrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const loginStrategy = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
} as passportLocal.IStrategyOptionsWithRequest

passport.use('login', new LocalStrategy(loginStrategy, async (req, email, password, done) => {
  try {
    const user = await getUserByEmail({ email: email });    
    const decryptPassword = await Auth.decryptAES(password);
    if (!(await Auth.comparePassword(decryptPassword, user.password))) {
      return done(null, null, { message: 'ex_incorrect_password' });
    }
    const token = Auth.signLoginToken({
      userId: user._id,
      username: user.username
    } as IJWTSignModel);

    return done(null, {
      userId: user._id,
      username: user.username,
      jwt: token
    });
  } catch (err) {
    return done(err);
  }
}));

const authStrategy = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: globalVars.jwtSecret
};

passport.use('authenicate', new JWTstrategy(authStrategy, async (jwt_payload: IJWTPayloadModel, done) => {
  try {
    done(null, jwt_payload);
  } catch (err) {
    done(err);
  }
}));
