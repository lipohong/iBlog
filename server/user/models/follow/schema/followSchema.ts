import * as mongoose from 'mongoose';
import FollowStatus from '../enum/followStatusEnum';

const Schema = mongoose.Schema;

const FollowSchema = new Schema({
  follow: String,
  userId: String,
  status: {
    type: String,
    default: FollowStatus.published
  }
}, { versionKey: false, timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });

export default FollowSchema;