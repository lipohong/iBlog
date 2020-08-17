import * as mongoose from 'mongoose';
import BlogStatus from '../enum/blogStatus';

const Schema = mongoose.Schema;


const BlogSchema = new Schema({
  userId: String,
  title: String,
  content: String,
  categories: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    default: BlogStatus.private
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { versionKey: false, timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });

export default BlogSchema;