import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import CollectionModel  from '../models/collection/class/collectionModel';
import CollectionStatusEnum from '../models/collection/enum/collectionStatusEnum';
import { getCollection, saveNewCollection, updateCollection } from '../services/collectionService';

export class CommentController {

  public getCollectionById = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.collectionId, isDeleted: false };
      const collection = await getCollection(expression);
      const userId = _.get(req, 'state.jwtPayload.userId');
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (collection.userId !== userId || !isAdmin) {
        if (collection.status !== CollectionStatusEnum.published) {
          throw new Error('ex_cannot_find_comment');
        }
      }

      return res.success(null, new CollectionModel(collection, 'fetch'));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getCollectionAmountForBlogs = async (req: IERequest, res: IEResponse) => {
    try {
      const blogIds = req.body.blogIds;
      if (!blogIds || blogIds.length === 0) {
        return res.success(null, {});
      }
      let expression: object = { blogId: { $in: blogIds }, status: CommentStatus.published };
      const resultObject = await getCommentPagination(expression, null, null);
      const commentListMap = _.groupBy(resultObject.commentList, 'blogId');
      let blogsCommentAmount = {};

      blogIds.forEach(blogId => {
        blogsCommentAmount[blogId] = !!commentListMap[blogId] ? commentListMap[blogId].length : 0;
      });

      return res.success(null, blogsCommentAmount);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getMyComments = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { userId: req.state.jwtPayload.userId };
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (!isAdmin) {
        expression['isDeleted'] = false;
      }
      const page = req.query.page;
      const perPage = req.query.perPage;
      let pageObject = null;
      if (page && perPage) {
        pageObject = {
          page: Number(page),
          perPage: Number(perPage)
        }
      }
      const resultObject = await getCommentPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public create = async (req: IERequest, res: IEResponse) => {
    try {
      const model = new CommentModel(req.body, 'post');
      if (!model.blogId) {
        throw new Error('ex_no_blog_id');
      }
      if (!model.comment || !model.comment.trim()) {
        throw new Error('ex_no_comment');
      }
      model.comment = model.comment.trim();
      model.userId = req.state.jwtPayload.userId;
      const comment = await saveNewComment(model);

      return res.success("msg_create_comment_success", comment);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public update = async (req: IERequest, res: IEResponse) => {
    try {
      const model = new CommentModel(req.body, 'put');      
      const expression = { _id: req.params.commentId, userId: req.state.jwtPayload.userId, isDeleted: false };
      await getComment(expression);
      if (model.comment) {
        model.comment = model.comment.trim();
      }

      return res.success("msg_update_comment_success", await updateComment(expression, model));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public remove = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.commentId, userId: req.state.jwtPayload.userId, isDeleted: false };
      const comment = await getComment(expression);      
      if (!comment) {
        throw new Error('ex_cannot_find_comment');
      }
      await updateComment(expression, { isDeleted: true });

      return res.success("msg_remove_comment_success", null);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}