import * as mongoose from 'mongoose';
import FollowModel from '../models/follow/class/followModel';
import FollowListPaginationModel from '../models/follow/class/followListPaginationModel'
import FollowSchema from '../models/follow/schema/followSchema';
import { removeUndefinedField } from '../utils/removeUndefinedField';
import { IPageModel } from '../models/commonModel';

const Follow = mongoose.model('Follow', FollowSchema, 'Follow');

async function getFollow(expression: object): Promise<FollowModel> {
  try {
    const follow: any = await Follow.findOne(expression).lean();

    return follow;
  }
  catch (err) {
    throw err;
  }
}

async function getFollowPagination(expression: object, pageObj: IPageModel, option: object): Promise<FollowListPaginationModel> {
  try {

    let pagination = null;
    if (pageObj) {
      const total: number = await Follow.countDocuments(expression).lean();

      if (!option) {
        option = { skip: pageObj.perPage * (pageObj.page - 1), limit: pageObj.perPage };
      }

      pagination = {
        totalItems: total,
        totalPage: Math.ceil(total / pageObj.perPage),
        perPage: pageObj.perPage,
        currentPage: pageObj.page,
      };
    }

    let followResultList: FollowModel[] = await Follow.find(expression, null, option).sort({ createdDate: -1 }).lean();

    const result = new FollowListPaginationModel({
      followList: followResultList,
      pagination: pagination
    });

    return result;
  }
  catch (err) {
    throw err;
  }
}

async function saveNewFollow(model: FollowModel): Promise<FollowModel> {
  try {
    const follow: any = await new Follow(model).save();

    return new FollowModel(follow, 'fetch');
  }
  catch (err) {
    throw err;
  }
}

async function updateFollow(expression: object, updateFields: object): Promise<FollowModel> {
  try {
    let follow = await Follow.findOneAndUpdate(expression, { $set: removeUndefinedField(updateFields) }).lean();
    follow = await Follow.findOne(expression);

    return new FollowModel(follow, 'fetch');
  }
  catch (err) {
    throw err;
  }
}

async function removeFollow(expression: object): Promise<Boolean> {
  try {
    await Follow.deleteOne(expression).lean();

    return true;
  }
  catch (err) {
    throw err;
  }
}

export { getFollow, getFollowPagination, saveNewFollow, updateFollow, removeFollow }