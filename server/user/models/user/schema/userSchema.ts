import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserInfo = new Schema({
  avatar: String,
  description: String,
}, { _id: false });

const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  isActived: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  verifyCode: String,
  userInfo: UserInfo,
}, { versionKey: false, timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });

export default UserSchema;