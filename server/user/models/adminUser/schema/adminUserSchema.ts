import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdminUserSchema = new Schema({
  userId: String,
  email: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { versionKey: false, timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });

export default AdminUserSchema;