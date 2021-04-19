const mongoose = require('mongoose');
import { ReadPreference } from 'mongodb';
import globalVars from '../../models/globalVars';
import { FollowModel, FollowStatusEnum } from '../../models';
import { getFollow, getFollowPagination, saveNewFollow, updateFollow, removeFollow } from '../followService';


describe("Test Follow Service APIs", () => {
  let followId: string;
  const testFollowInitialData = {
    follow: 'my favourite author\'s id',
    userId: 'my Id',
    status: FollowStatusEnum.published
  }
  const testFollowUpdatedData = {
    ...testFollowInitialData, status: FollowStatusEnum.private
  }

  // connect to db before test
  beforeAll(async () => {
    await mongoose.connect(globalVars.mongoUrl, { useNewUrlParser: true, readPreference: ReadPreference.SECONDARY_PREFERRED });
  });
  // close connection after test
  afterAll(async () => {
    // remove the test data for db
    await removeFollow({ _id: followId });
    await mongoose.connection.close();
  });

  test('saveNewFollow() and getFollow()', async (done) => {
    try {
      const testFollow = await saveNewFollow(new FollowModel(testFollowInitialData, 'post'));
      followId = testFollow._id;  // save id
      const testFollowData = await getFollow({ _id: followId })

      expect(testFollowData).toMatchObject(testFollowInitialData);
      done();
    } catch (err) {
      done(err);
    }
  });

  test('updateFollow()', async (done) => {
    try {
      const expression = { _id: followId };
      await updateFollow(expression, { status: FollowStatusEnum.private });
      const testFollow = await getFollow(expression);
      expect(testFollow).toMatchObject(testFollowUpdatedData);
      done();
    } catch (err) {
      done(err);
    }
  });

  test('getFollowPagination()', async (done) => {
    try {
      const expression = { status: FollowStatusEnum.private };
      const privateFollowsList = await getFollowPagination(expression, null, null);      
      expect(privateFollowsList.followList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ _id: followId })
        ])
      );
      done();
    } catch (err) {
      done(err);
    }
  });
})


