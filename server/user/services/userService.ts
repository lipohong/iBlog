import * as mongoose from 'mongoose';
import UserModel from '../models/user/class/userModel';
import UserSchema from '../models/user/schema/userSchema';
// import { formExpressionFromRestriction } from '../utils/restriction';

const User = mongoose.model('User', UserSchema, 'User');

async function getUser(expression: object): Promise<UserModel> {
  try {
    const user: any = await User.findOne(expression).lean();
    if (!user) {
      throw new Error('ex_cannot_find_user');
    }

    return new UserModel(user, 'get');
  }
  catch (err) {
    throw err;
  }
}

async function getUserByEmail(expression: object): Promise<UserModel> {
  try {
    const user: any = await getUser(expression);

    return new UserModel(user, 'post');
  }
  catch (err) {
    throw err;
  }
}

async function getUserById(expression: object): Promise<UserModel> {
  try {
    const user: any = await getUser(expression);

    return new UserModel(user, 'fetch');
  }
  catch (err) {
    throw err;
  }
}

async function getMyInfo(expression: object): Promise<UserModel> {
  try {
    const user: any = await getUser(expression);

    return new UserModel(user, 'get');
  }
  catch (err) {
    throw err;
  }
}

export { getUserByEmail, getUserById, getMyInfo }