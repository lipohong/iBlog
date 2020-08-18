import * as mongoose from 'mongoose';
import { IPageModel } from '../models/commonModel';
import LikeModel from '../models/like/class/likeModel';
import LikeSchema from '../models/like/schema/likeSchema';
import { removeUndefinedField } from '../utils/removeUndefinedField';

const Like = mongoose.model('Like', LikeSchema, 'Like');

async function getLike(expression: object): Promise<LikeModel> {
  try {
    const like: any = await Like.findOne(expression).lean();

    return like;
  }
  catch (err) {
    throw err;
  }
}

async function getLikePagination(expression: object, pageObj: IPageModel, option: object): Promise<any> {
  try {

    let pagination = null;
    if (pageObj) {
      const total: number = await Like.countDocuments(expression).lean();

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

    let likeResultList: LikeModel[] = await Like.find(expression, null, option).sort({ createdDate: -1 }).lean();

    const result = {
      likeList: likeResultList,
      pagination: pagination
    };

    return result;
  }
  catch (err) {
    throw err;
  }
}

async function saveNewLike(model: LikeModel): Promise<LikeModel> {
  try {
    const like: any = await new Like(model).save();

    return new LikeModel(like, 'fetch');
  }
  catch (err) {
    throw err;
  }
}

async function updateLike(expression: object, updateFields: object): Promise<LikeModel> {
  try {
    const like = await Like.findOneAndUpdate(expression, { $set: removeUndefinedField(updateFields) }).lean();

    return new LikeModel(await getLike({ _id: like._id }), 'fetch');
  }
  catch (err) {
    throw err;
  }
}

export { getLike, getLikePagination, saveNewLike, updateLike }