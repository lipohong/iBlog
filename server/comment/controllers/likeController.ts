import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import LikeModel  from '../models/like/class/likeModel';
import { getLike, getLikePagination, saveNewLike, removeLike, getLikeAmount, getLikesUsingAggregate } from '../services/likeService';
import { getBlogList } from '../services/blogService';
import { getUserList } from '../services/userService';

export class LikeController {

  public getLikesByBlogId = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { blogId: req.params.blogId };
      const page = req.query.page;
      const perPage = req.query.perPage;
      let pageObject = null;
      if (page && perPage) {
        pageObject = {
          page: Number(page),
          perPage: Number(perPage)
        }
      }
      let resultObject = await getLikePagination(expression, pageObject, null);
      resultObject.likeList = resultObject.likeList.map(like => (new LikeModel(like, 'getLikesByBlogId')))

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public checkBlogLikedByUser = async (req: IERequest, res: IEResponse) => {
    try {
      const { blogId, userId } = req.params;
      let expression: object = { blogId, userId };
      const likeAmount = await getLikeAmount(expression);

      return res.success(null, { liked: likeAmount > 0 });
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getLikesAmountByBlogId = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { blogId: req.params.blogId };
      const likeAmount = await getLikeAmount(expression);

      return res.success(null, likeAmount);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getLikeAmountForBlogs = async (req: IERequest, res: IEResponse) => {
    try {
      const blogIds = req.body.blogIds;
      if (!blogIds || blogIds.length === 0) {
        return res.success(null, {});
      }
      let expression: object = { blogId: { $in: blogIds } };
      let resultObject = await getLikePagination(expression, null, null);
      const likeListMap = _.groupBy(resultObject.likeList, 'blogId');
      let blogsLikeAmount = {};
      blogIds.forEach(blogId => {
        blogsLikeAmount[blogId] = !!likeListMap[blogId] ? likeListMap[blogId].length : 0;
      });

      return res.success(null, blogsLikeAmount);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getMyLikes = async (req: IERequest, res: IEResponse) => {
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
      const resultObject = await getLikePagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getTop5LikedBlogs = async (req: IERequest, res: IEResponse) => {
    try {
      const expresssions = [
        { $group: { _id: "$blogId", likes: { $sum: 1 } } },
        { $sort: { likes: -1 } },
        { $limit: 20 }
      ];
      const resultObject = await getLikesUsingAggregate(expresssions);
      const blogIdsList = resultObject.map(item => (item._id));      
      let blogList = await getBlogList(blogIdsList);
      const userIdsList = blogList.map(item => (item.userId));
      const userList = await getUserList(userIdsList);
      const userListMap = _.keyBy(userList, '_id');      
      blogList = blogList.map(item => ({
        ...item,
        author: {
          username: _.get(userListMap[item.userId], 'username', ''),
          email: _.get(userListMap[item.userId], 'email', ''),
          userInfo: {
            avatar: _.get(userListMap[item.userId], 'userInfo.avatar', '')
          }
        }
      }));
      const blogListMap = _.keyBy(blogList, '_id');
      let returnList = [];
      for (let like of resultObject) {
        if (blogListMap[like._id]) {
          returnList.push({
            ...like,
            ...blogListMap[like._id]
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

  public likeOrUnlike = async (req: IERequest, res: IEResponse) => {
    try {
      let model = new LikeModel({}, 'post');
      model.blogId = req.params.blogId;
      const userId = req.state.jwtPayload.userId;
      const like = await getLike({ blogId: model.blogId, userId });      
      if (!like) {
        model.userId = userId;
        const like = await saveNewLike(model);

        return res.success("msg_create_like_success", like);
      } else {
        await removeLike({ _id: like._id });

        return res.success("msg_remove_like_success", null);
      }
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}