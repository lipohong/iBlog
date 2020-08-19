import * as mongoose from 'mongoose';
import CollectionStatusEnum from '../enum/collectionStatusEnum';

const Schema = mongoose.Schema;


const CollectionSchema = new Schema({
  userId: String,
  name: String,
  description: String,
  blogIds: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    default: CollectionStatusEnum.private
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { versionKey: false, timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });

export default CollectionSchema;