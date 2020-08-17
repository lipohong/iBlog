import * as mongoose from 'mongoose';
import CommentStatus from '../enum/commentStatus';

const Schema = mongoose.Schema;


const CommentSchema = new Schema({
  blogId: String,
  userId: String,
  comment: String,
  status: {
    type: String,
    default: CommentStatus.published
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { versionKey: false, timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });

export default CommentSchema;