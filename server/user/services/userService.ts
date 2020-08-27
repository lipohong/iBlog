import * as mongoose from 'mongoose';
import UserModel from '../models/user/class/userModel';
import UserSchema from '../models/user/schema/userSchema';
// import { formExpressionFromRestriction } from '../utils/restriction';
import { removeUndefinedField } from '../utils/removeUndefinedField';

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

async function getUsers(expression: object): Promise<UserModel[]> {
  try {
    const users: any = await User.find(expression).lean();

    return users;
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

async function updateUser(expression: object, updateFields: object): Promise<any> {
  try {
    let user = await User.findOneAndUpdate(expression, { $set: removeUndefinedField(updateFields) }).lean();
    user =  await User.findOne(expression);

    return user;
  }
  catch (err) {
    throw err;
  }
}

export { getUser, getMyInfo, saveNewUser, updateUser, getUsers }