import * as mongoose from 'mongoose';
import { IPageModel } from '../models/commonModel';
import CommentModel from '../models/comment/class/commentModel';
import CommentListPaginationModel from '../models/comment/class/commentListPaginationModel'
import CommentSchema from '../models/comment/schema/commentSchema';
import { removeUndefinedField } from '../utils/removeUndefinedField';

const Comment = mongoose.model('Comment', CommentSchema, 'Comment');

async function getComment(expression: object): Promise<CommentModel> {
  try {
    const comment: any = await Comment.findOne(expression).lean();
    if (!comment) {
      throw new Error('ex_cannot_find_comment');
    }  
    return new CommentModel(comment, 'get');
  }
  catch (err) {
    throw err;
  }
}

async function getCommentPagination(expression: object, pageObj: IPageModel, option: object): Promise<CommentListPaginationModel> {
  try {

    let pagination = null;
    if (pageObj) {
      const total: number = await Comment.countDocuments(expression).lean();

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

    let commentResultList: CommentModel[] = await Comment.find(expression, null, option).sort({ createdDate: -1 }).lean();

    const result = new CommentListPaginationModel({
      commentList: commentResultList,
      pagination: pagination
    });

    return result;
  }
  catch (err) {
    throw err;
  }
}

async function getCommentAmount(expression: object): Promise<Number> {
  try {
    const total: number = await Comment.countDocuments(expression).lean();

    return total;
  }
  catch (err) {
    throw err;
  }
}

async function getTop5CommentedBlogs(expression: Array<Object>): Promise<Array<any>> {
  try {

    let commentResultList = await Comment.aggregate(expression);

    return commentResultList;
  }
  catch (err) {
    throw err;
  }
}

async function saveNewComment(model: CommentModel): Promise<CommentModel> {
  try {
    const comment: any = await new Comment(model).save();

    return new CommentModel(comment, 'fetch');
  }
  catch (err) {
    throw err;
  }
}

async function updateComment(expression: object, updateFields: object): Promise<CommentModel> {
  try {
    const comment = await Comment.findOneAndUpdate(expression, { $set: removeUndefinedField(updateFields) }).lean();

    return new CommentModel(await getComment({ _id: comment._id }), 'fetch');
  }
  catch (err) {
    throw err;
  }
}

export { getComment, getCommentPagination, saveNewComment, updateComment, getCommentAmount, getTop5CommentedBlogs }