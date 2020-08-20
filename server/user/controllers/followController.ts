import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import FollowModel  from '../models/follow/class/followModel';
import { getFollow, getFollowPagination, saveNewFollow, updateFollow, removeFollow } from '../services/followService';
import FollowStatusEnum from '../models/follow/enum/followStatusEnum';

export class FollowController {

  public getFollowsByUserId = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { userId: req.params.userId };
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (!isAdmin) {
        expression['status'] = FollowStatusEnum.published;
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
      let resultObject = await getFollowPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getFansByUserId = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { follow: req.params.userId };
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (!isAdmin) {
        expression['status'] = FollowStatusEnum.published;
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
      let resultObject = await getFollowPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getMyFollows = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { userId: req.state.jwtPayload.userId };
      const page = req.query.page;
      const perPage = req.query.perPage;
      let pageObject = null;
      if (page && perPage) {
        pageObject = {
          page: Number(page),
          perPage: Number(perPage)
        }
      }
      const resultObject = await getFollowPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getMyFans = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { follow: req.state.jwtPayload.userId, status: FollowStatusEnum.published };
      const page = req.query.page;
      const perPage = req.query.perPage;
      let pageObject = null;
      if (page && perPage) {
        pageObject = {
          page: Number(page),
          perPage: Number(perPage)
        }
      }
      const resultObject = await getFollowPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public followOrUnfollow = async (req: IERequest, res: IEResponse) => {
    try {
      if (req.params.userId === req.state.jwtPayload.userId ) {
        throw new Error('ex_follow_self_not_allowed');
      }
      let model = new FollowModel({}, 'post');
      const follow = await getFollow({ follow: req.params.userId, userId: req.state.jwtPayload.userId });      
      if (!follow) {
        model.follow = req.params.userId;
        model.userId = req.state.jwtPayload.userId;
        const follow = await saveNewFollow(model);

        return res.success("msg_follow_success", follow);
      } else {
        await removeFollow({ _id: follow._id });

        return res.success("msg_unfollow_success", null);
      }
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public update = async (req: IERequest, res: IEResponse) => {
    try {
      let model = new FollowModel(req.body, 'put');
      let expression = { _id: req.params.followId };
      const isAdmin = req.state.jwtPayload.isAdmin;
      if (!isAdmin) {
        expression['userId'] = req.state.jwtPayload.userId;
      }
      const follow = await getFollow(expression);      
      if (!follow) {

        throw new Error('ex_no_follow_record');
      }

      return res.success("msg_update_follow_success", await updateFollow(expression, model));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}