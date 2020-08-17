import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import { IJWTPayloadModel } from '../models/commonModel';
import globalVars from '../models/globalVars';

const JWTstrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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
