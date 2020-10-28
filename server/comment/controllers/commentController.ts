import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import CommentModel  from '../models/comment/class/commentModel';
import CommentStatus from '../models/comment/enum/commentStatus';
import { getComment, getCommentPagination, saveNewComment, updateComment, getCommentAmount, getCommentsUsingAggregate } from '../services/commentService';
import { getUserList } from '../services/userService';
import { getBlogList } from '../services/blogService';

export class CommentController {

  public getCommentById = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.commentId, isDeleted: false };
      const comment = await getComment(expression);
      const userId = _.get(req, 'state.jwtPayload.userId');
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (comment.userId !== userId || !isAdmin) {
        if (comment.status !== CommentStatus.published) {
          throw new Error('ex_cannot_find_comment');
        }
      }

      return res.success(null, new CommentModel(comment, 'fetch'));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getCommentsByBlogId = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { blogId: req.params.blogId, status: CommentStatus.published };
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
      let resultObject = await getCommentPagination(expression, pageObject, null);
      const { commentList } = resultObject;
      const userIds = _.map(commentList, 'userId');
      const userList = await getUserList(userIds);
      const userListMap = _.keyBy(userList, '_id');
      resultObject.commentList = commentList.map(comment => ({
        ...comment,
        user: userListMap[comment.userId]
      }))

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getCommentAmountByBlogId = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { blogId: req.params.blogId, status: CommentStatus.published };
      const commentAmount = await getCommentAmount(expression);

      return res.success(null, commentAmount);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getCommentAmountForBlogs = async (req: IERequest, res: IEResponse) => {
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
      let resultObject = await getCommentPagination(expression, pageObject, null);
      const { commentList } = resultObject;
      const userIds = _.map(commentList, 'userId');
      const userList = await getUserList(userIds);
      const userListMap = _.keyBy(userList, '_id');
      resultObject.commentList = commentList.map(comment => ({
        ...comment,
        user: userListMap[comment.userId]
      }))

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getTop5CommentedBlogs = async (req: IERequest, res: IEResponse) => {
    try {
      const expresssions = [
        { $match: { isDeleted: false } },
        { $group: { _id: "$blogId", comments: { $sum: 1 } } },
        { $sort: { comments: -1 } },
        { $limit: 20 }
      ];
      const resultObject = await getCommentsUsingAggregate(expresssions);
      const blogIdsList = resultObject.map(item => (item._id));
      const blogList = await getBlogList(blogIdsList);
      const blogListMap = _.keyBy(blogList, '_id');
      let returnList = [];
      for (let comment of resultObject) {
        if (blogListMap[comment._id]) {
          returnList.push({
            ...comment,
            ...blogListMap[comment._id]
          });
          if (returnList.length >= 5) break;
        }
      }

      return res.success(null, returnList);
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