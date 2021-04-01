const mongoose = require('mongoose');
import { ReadPreference } from 'mongodb';
import globalVars from '../../models/globalVars';
import { UserModel } from '../../models';
import { getUser, getMyInfo, saveNewUser, updateUser, getUsers, removeUser } from '../userService';


describe("Test User APIs", () => {
  let userId: string;
  const testUserInitialData = {
    username: 'test username',
    password: 'test password',
    email: 'test email',
    verifyCode: 'test verifyCode'
  }
  const testUserInfo = {
    avatar: 'test avatar',
    description: 'test description'
  }
  const testUserData = { ...testUserInitialData, userInfo: testUserInfo };

  // connect to db before test
  beforeAll(async () => {
    await mongoose.connect(globalVars.mongoUrl, { useNewUrlParser: true, readPreference: ReadPreference.SECONDARY_PREFERRED });
  });
  // close connection after test
  afterAll(async () => {
    // remove the test user data for db
    await removeUser({ _id: userId });
    await mongoose.connection.close();
  });

  test('saveNewUser()', async (done) => {
    try {
      const testUser = await saveNewUser(new UserModel(testUserData, 'post'));      
      userId = testUser._id;  // save id of test user

      expect(testUser).toMatchObject(testUserInitialData);
      done();
    } catch (err) {
      done(err);
    }
  });

  test('updateUser()', async (done) => {
    try {
      const expression = { _id: userId };
      const testUser = await updateUser(expression, { userInfo: testUserInfo });      
      expect(testUser).toMatchObject(testUserData);
      done();
    } catch (err) {
      done(err);
    }
  });

  
  test('getUser()', async (done) => {
    try {
      const expression = { _id: userId };
      const testUser = await getUser(expression);
      
      expect(testUser).toMatchObject(testUserData);
      done();
    } catch (err) {
      done(err);
    }
  });

  test('getMyInfo()', async (done) => {
    try {
      const expression = { _id: userId };
      const testUser = await getMyInfo(expression);      
      expect(testUser).toMatchObject(testUserData);
      done();
    } catch (err) {
      done(err);
    }
  });
})


