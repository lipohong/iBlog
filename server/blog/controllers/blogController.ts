import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import BlogModel  from '../models/blog/class/blogModel';
import BlogStatus from '../models/blog/enum/blogStatus';
import { getBlog, getBlogPagination, saveNewBlog, updateBlog } from '../services/blogService';

export class BlogController {

  public getBlogById = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.blogId, isDeleted: false };
      const blog = await getBlog(expression);
      const userId = _.get(req, 'state.jwtPayload.userId');
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (blog.userId !== userId || !isAdmin) {
        if (blog.status !== BlogStatus.published) {
          throw new Error('ex_cannot_find_blog');
        }
      }

      return res.success(null, new BlogModel(blog, 'fetch'));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public search = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { status: BlogStatus.published };
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (!isAdmin) {
        expression['isDeleted'] = false;
      }
      const page = req.query.page;
      const perPage = req.query.perPage;
      let pageObject = null;
      if (page && perPage) {
        pageObject = {
          page,
          perPage
        }
      }
      const resultObject = await getBlogPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getMyBlogs = async (req: IERequest, res: IEResponse) => {
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
      const resultObject = await getBlogPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public create = async (req: IERequest, res: IEResponse) => {
    try {
      const model = new BlogModel(req.body, 'post');
      if (!model.title || !model.title.trim()) {
        throw new Error('ex_no_title');
      }
      model.title = model.title.trim();
      model.userId = req.state.jwtPayload.userId;
      const blog = await saveNewBlog(model);

      return res.success("msg_update_blog_success", blog);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public update = async (req: IERequest, res: IEResponse) => {
    try {
      const model = new BlogModel(req.body, 'put');      
      const expression = { _id: req.params.blogId, userId: req.state.jwtPayload.userId, isDeleted: false };
      await getBlog(expression);
      if (model.title) {
        model.title = model.title.trim();
      }

      return res.success("msg_update_blog_success", await updateBlog(expression, model));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public remove = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.blogId, userId: req.state.jwtPayload.userId, isDeleted: false };
      const blog = await getBlog(expression);
      if (!blog) {
        throw new Error('ex_cannot_find_blog');
      }
      await updateBlog(expression, { isDeleted: true });

      return res.success("msg_remove_blog_success", null);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}