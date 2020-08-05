import * as mongoose from 'mongoose';
import AdminUserModel from '../models/adminUser/class/adminUserModel';
import AdminUserSchema from '../models/adminUser/schema/adminUserSchema';

const User = mongoose.model('AdminUser', AdminUserSchema, 'AdminUser');

async function getAdminUser(expression: object): Promise<AdminUserModel> {
  try {
    const adminUser: any = await User.findOne(expression).lean();

    return adminUser;
  }
  catch (err) {
    throw err;
  }
}

async function checkIfAdminUserExist(expression: object): Promise<Boolean> {
    try {
      const adminUser: any = await getAdminUser(expression);
  
      return !!adminUser;
    }
    catch (err) {
      throw err;
    }
  }

export { checkIfAdminUserExist }