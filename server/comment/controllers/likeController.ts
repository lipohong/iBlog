import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import LikeModel  from '../models/like/class/likeModel';
import { getLike, getLikePagination, saveNewLike, updateLike } from '../services/likeService';

export class LikeController {

  public getLikesByBlogId = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { blogId: req.params.blogId};
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
      const model = new LikeModel(req.body, 'post');
      if (!model.blogId) {
        throw new Error('ex_no_blog_id');
      }
      const result = await getLike({ blogId: model.blogId });
      if (!result) {
        model.userId = req.state.jwtPayload.userId;
        const like = await saveNewLike(model);

        return res.success("msg_create_like_success", like);
      } else {
        // remove like

        return res.success("msg_remove_like_success", null);
      }
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}