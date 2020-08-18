import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import LikeModel  from '../models/like/class/likeModel';
import { getLike, getLikePagination, saveNewLike, removeLike } from '../services/likeService';

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