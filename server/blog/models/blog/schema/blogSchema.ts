import * as mongoose from 'mongoose';
import BlogStatus from '../enum/blogStatus';
import BlogLanguage from '../enum/blogLanguage';

const Schema = mongoose.Schema;


const BlogSchema = new Schema({
  userId: String,
  title: String,
  cover: String,
  content: Object,
  categories: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  language: {
    type: String,
    default: BlogLanguage.en
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