import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  blogId: String,
  userId: String,
}, { versionKey: false, timestamps: { createdAt: 'createdDate' } });

export default LikeSchema;