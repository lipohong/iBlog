import * as mongoose from 'mongoose';
import UserModel from '../models/user/class/userModel';
import UserSchema from '../models/user/schema/userSchema';
// import { formExpressionFromRestriction } from '../utils/restriction';

const User = mongoose.model('User', UserSchema, 'User');

async function getUser(expression: object): Promise<UserModel> {
  try {
    const user: any = await User.findOne(expression).lean();

    return user;
  }
  catch (err) {
    throw err;
  }
}

async function getUserByEmail(expression: object): Promise<UserModel> {
  try {
    const user: any = await getUser(expression);

    return user;
  }
  catch (err) {
    throw err;
  }
}

async function getUserById(expression: object): Promise<UserModel> {
  try {
    const user: any = await getUser(expression);

    return user;
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

async function saveNewUser(model: UserModel): Promise<Boolean> {
  try {
    const user: any = await new User(model).save();

    return !!user;
  }
  catch (err) {
    throw err;
  }
}

export { getUserByEmail, getUserById, getMyInfo, saveNewUser }